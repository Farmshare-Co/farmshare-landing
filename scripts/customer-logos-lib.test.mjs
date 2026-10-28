import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyHttpStatus,
  normalizeName,
  parseNetworkCustomers,
  planCustomerSync,
  runCustomerLogoSync,
  sniffImage,
} from './customer-logos-lib.mjs';

const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

function customer(overrides = {}) {
  return {
    hubspotId: '100',
    name: 'Example Meats',
    state: 'MT',
    domain: 'example.test',
    logoUrl: 'https://cdn.example.test/logo.png',
    ...overrides,
  };
}

function processor(overrides = {}) {
  return {
    name: 'Example Meats',
    slug: 'example-meats',
    status: 'prospect',
    logo: null,
    ...overrides,
  };
}

test('a missing or login-walled endpoint is a no-op, and other errors are not', () => {
  assert.equal(classifyHttpStatus(404), 'noop');
  assert.equal(classifyHttpStatus(307), 'noop');
  assert.equal(classifyHttpStatus(302), 'noop');
  assert.equal(classifyHttpStatus(200), 'ok');
  assert.equal(classifyHttpStatus(503), 'error');
  assert.equal(classifyHttpStatus(401), 'error');
});

test('the dashboard array is accepted and anything else is rejected', () => {
  const parsed = parseNetworkCustomers(JSON.stringify([
    customer({ hubspotId: 100, logoUrl: null, domain: null, state: null, note: 'ignored' }),
  ]));
  assert.equal(parsed[0].hubspotId, '100');
  assert.equal(parsed[0].logoUrl, '');
  assert.equal(parsed[0].note, undefined);

  assert.throws(() => parseNetworkCustomers({ plants: 50 }));
  assert.throws(() => parseNetworkCustomers('<html>login</html>'));
  assert.throws(() => parseNetworkCustomers([{ name: 'Example Meats' }]));
  assert.throws(() => parseNetworkCustomers([{ hubspotId: '1', name: '   ' }]));
});

test('names match without confusing the two Lone Crow businesses', () => {
  assert.equal(normalizeName('C&J Meats'), normalizeName('C and J Meats'));
  assert.equal(normalizeName("B & R Meat Processing"), normalizeName('B and R Meat Processing'));
  assert.equal(normalizeName("Follett's Meat Co."), 'folletts meat co');
  assert.notEqual(
    normalizeName('Lone Crow Meat Processing'),
    normalizeName('Lone Crow Ranch'),
  );

  const processors = [
    processor({
      name: 'Lone Crow Meat Processing',
      slug: 'lone-crow-meat-processing-connell-wa',
    }),
    processor({
      name: 'Lone Crow Ranch',
      slug: 'lone-crow-ranch-loon-lake-wa',
    }),
  ];
  const plan = planCustomerSync(processors, [
    customer({ hubspotId: '7', name: 'Lone Crow Meat Processing', logoUrl: '' }),
  ], []);

  assert.equal(plan.processors[0].status, 'customer');
  assert.equal(plan.processors[0].hubspotId, '7');
  assert.equal(plan.processors[1].status, 'prospect');
  assert.equal(plan.processors[1].logo, null);
  assert.equal(plan.processors[1].hubspotId, undefined);
});

test('hubspotId wins over a different display name and does not rename the record', () => {
  const processors = [
    processor({
      name: 'Mad Dog Ranch',
      slug: 'md-meats-bliss-id',
      status: 'customer',
      logo: '/logos/md-meats-bliss-id.jpg',
      hubspotId: '55',
    }),
  ];
  const plan = planCustomerSync(processors, [
    customer({ hubspotId: '55', name: 'MD Meats LLC', logoUrl: 'https://cdn.example.test/other.png' }),
  ], ['md-meats-bliss-id.jpg']);

  assert.equal(plan.processors[0].name, 'Mad Dog Ranch');
  assert.equal(plan.processors[0].status, 'customer');
  assert.equal(plan.processors[0].logo, '/logos/md-meats-bliss-id.jpg');
  assert.equal(plan.downloads.length, 0);
  assert.equal(plan.promoted, 0);
  assert.equal(plan.demoted, 0);
});

test('a customer missing from the feed becomes a prospect, and a matched prospect is promoted', () => {
  const processors = [
    processor({ name: 'Still Active', slug: 'still-active', status: 'customer', logo: '/logos/still-active.png' }),
    processor({ name: 'Churned Plant', slug: 'churned-plant', status: 'customer', logo: '/logos/churned.png' }),
    processor({ name: 'New Plant', slug: 'new-plant', status: 'prospect', logo: null }),
    processor({ name: 'Unrelated Prospect', slug: 'unrelated', status: 'prospect', logo: null }),
  ];
  const plan = planCustomerSync(processors, [
    customer({ hubspotId: '1', name: 'Still Active', logoUrl: '' }),
    customer({ hubspotId: '2', name: 'New Plant', logoUrl: 'https://cdn.example.test/new.png' }),
  ], ['still-active.png']);

  assert.equal(plan.processors[0].status, 'customer');
  assert.equal(plan.processors[1].status, 'prospect');
  assert.equal(plan.processors[1].logo, '/logos/churned.png');
  assert.equal(plan.processors[2].status, 'customer');
  assert.equal(plan.processors[2].hubspotId, '2');
  assert.deepEqual(plan.downloads, [{ slug: 'new-plant', url: 'https://cdn.example.test/new.png' }]);
  assert.equal(plan.processors[3].status, 'prospect');
  assert.equal(plan.promoted, 1);
  assert.equal(plan.demoted, 1);
});

test('logoLocked records and files already on disk are not replaced', () => {
  const processors = [
    processor({
      name: 'Locked Meats',
      slug: 'locked-meats',
      status: 'customer',
      logo: 'https://cdn.example.test/old.jpg',
      logoLocked: true,
    }),
    processor({
      name: 'Local Meats',
      slug: 'local-meats',
      status: 'customer',
      logo: '/logos/local-meats.png',
    }),
    processor({
      name: 'Reuse Meats',
      slug: 'reuse-meats',
      status: 'prospect',
      logo: null,
    }),
  ];
  const plan = planCustomerSync(processors, [
    customer({ hubspotId: '1', name: 'Locked Meats', logoUrl: 'https://cdn.example.test/new.jpg' }),
    customer({ hubspotId: '2', name: 'Local Meats', logoUrl: 'https://cdn.example.test/new.png' }),
    customer({ hubspotId: '3', name: 'Reuse Meats', logoUrl: 'https://cdn.example.test/reuse.png' }),
  ], ['local-meats.png', 'reuse-meats.png']);

  assert.equal(plan.processors[0].logo, 'https://cdn.example.test/old.jpg');
  assert.equal(plan.processors[1].logo, '/logos/local-meats.png');
  assert.equal(plan.processors[2].logo, '/logos/reuse-meats.png');
  assert.equal(plan.downloads.length, 0);
});

test('an ambiguous name is not matched and is not demoted', () => {
  const processors = [
    processor({ name: 'Smith Meats', slug: 'smith-a', status: 'customer', logo: '/logos/smith-a.png' }),
    processor({ name: 'Smith Meats', slug: 'smith-b', status: 'customer', logo: '/logos/smith-b.png' }),
    processor({ name: 'Other Meats', slug: 'other', status: 'customer', logo: '/logos/other.png' }),
    processor({ name: 'Extra Meats', slug: 'extra', status: 'customer', logo: '/logos/extra.png' }),
  ];
  const plan = planCustomerSync(processors, [
    customer({ hubspotId: '1', name: 'Smith Meats', logoUrl: '' }),
    customer({ hubspotId: '2', name: 'Other Meats', logoUrl: '' }),
    customer({ hubspotId: '3', name: 'Extra Meats', logoUrl: '' }),
  ], ['smith-a.png', 'smith-b.png', 'other.png', 'extra.png']);

  assert.equal(plan.processors[0].status, 'customer');
  assert.equal(plan.processors[0].hubspotId, undefined);
  assert.equal(plan.processors[1].status, 'customer');
  assert.equal(plan.processors[2].status, 'customer');
  assert.equal(plan.processors[2].hubspotId, '2');
  assert.equal(plan.processors[3].hubspotId, '3');
  assert.equal(plan.ambiguous.length, 1);
  assert.equal(plan.demoted, 0);
});

test('a thin match is refused and the input directory is left untouched', () => {
  const processors = [
    processor({ name: 'One', slug: 'one', status: 'customer' }),
    processor({ name: 'Two', slug: 'two', status: 'customer' }),
    processor({ name: 'Three', slug: 'three', status: 'customer' }),
    processor({ name: 'Four', slug: 'four', status: 'customer' }),
  ];
  const snapshot = JSON.stringify(processors);
  assert.throws(() => planCustomerSync(processors, [
    customer({ hubspotId: '1', name: 'One', logoUrl: '' }),
  ], []));
  assert.equal(JSON.stringify(processors), snapshot);
  assert.throws(() => planCustomerSync(processors, [], []));

  const half = planCustomerSync(processors, [
    customer({ hubspotId: '1', name: 'One', logoUrl: '' }),
    customer({ hubspotId: '2', name: 'Two', logoUrl: '' }),
  ], []);
  assert.equal(half.processors.filter((p) => p.status === 'customer').length, 2);
});

test('a second plan against an updated directory does not churn', () => {
  const processors = [
    processor({ name: 'Example Meats', slug: 'example-meats', status: 'prospect', logo: null }),
  ];
  const customers = [customer({ logoUrl: '' })];
  const first = planCustomerSync(processors, customers, ['example-meats.png']);
  const second = planCustomerSync(first.processors, customers, ['example-meats.png']);
  assert.equal(JSON.stringify(first.processors), JSON.stringify(second.processors));
  assert.equal(second.promoted, 0);
  assert.equal(second.demoted, 0);
  assert.equal(second.downloads.length, 0);
  assert.equal(second.hubspotIdsAdded, 0);
});

test('svg script payloads are rejected and a real png is accepted', () => {
  assert.equal(sniffImage(TINY_PNG), 'png');
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  assert.equal(sniffImage(svg), null);
  const plain = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>');
  assert.equal(sniffImage(plain), 'svg');
  assert.equal(sniffImage(Buffer.from('not an image, just some bytes!!')), null);
});

test('a 404 or a login redirect writes nothing', async () => {
  for (const status of [404, 307]) {
    let read = false;
    let wrote = false;
    const result = await runCustomerLogoSync({
      url: 'https://example.test/api/network-customers',
      fetchImpl: async () => ({ status, text: async () => 'nope' }),
      readProcessors() {
        read = true;
        return [];
      },
      writeProcessors() {
        wrote = true;
      },
      listLogoFiles: () => [],
      writeLogoFile() {
        wrote = true;
      },
    });
    assert.equal(result.changed, false);
    assert.equal(result.reason, 'not-found');
    assert.equal(read, false);
    assert.equal(wrote, false);
  }
});

test('a failed dashboard response does not write, and a download does not overwrite', async () => {
  await assert.rejects(() => runCustomerLogoSync({
    url: 'https://example.test/api/network-customers',
    fetchImpl: async () => ({ status: 503, text: async () => '{"error":"unavailable"}' }),
    readProcessors: () => [],
    writeProcessors() {
      throw new Error('should not write');
    },
    listLogoFiles: () => [],
    writeLogoFile() {
      throw new Error('should not write a logo');
    },
  }));

  const stored = new Map([['example-meats.png', Buffer.from('already-there')]]);
  let wroteFile = false;
  const written = [];
  const result = await runCustomerLogoSync({
    url: 'https://example.test/api/network-customers',
    fetchImpl: async (url) => {
      if (String(url).includes('network-customers')) {
        return {
          status: 200,
          text: async () => JSON.stringify([customer()]),
        };
      }
      return {
        status: 200,
        ok: true,
        arrayBuffer: async () => TINY_PNG,
      };
    },
    readProcessors: () => [processor({ status: 'customer', logo: null })],
    writeProcessors(processors) {
      written.push(processors);
    },
    listLogoFiles: () => [],
    fileExists(filename) {
      return stored.has(filename);
    },
    writeLogoFile() {
      wroteFile = true;
    },
  });

  assert.equal(wroteFile, false);
  assert.equal(result.changed, true);
  assert.equal(written[0][0].logo, '/logos/example-meats.png');
  assert.equal(written[0][0].status, 'customer');
  assert.equal(stored.get('example-meats.png').toString(), 'already-there');
});

test('dry-run fetches the list and does not write status or logos', async () => {
  let wrote = false;
  const result = await runCustomerLogoSync({
    url: 'https://example.test/api/network-customers',
    dryRun: true,
    fetchImpl: async () => ({
      status: 200,
      text: async () => JSON.stringify([
        customer({ name: 'New Plant', logoUrl: 'https://cdn.example.test/new.png' }),
      ]),
    }),
    readProcessors: () => [processor({ name: 'New Plant', slug: 'new-plant', status: 'prospect' })],
    writeProcessors() {
      wrote = true;
    },
    listLogoFiles: () => [],
    writeLogoFile() {
      wrote = true;
    },
  });
  assert.equal(wrote, false);
  assert.equal(result.changed, false);
  assert.equal(result.wouldChange, true);
  assert.equal(result.reason, 'dry-run');
  assert.equal(result.promoted, 1);
  assert.equal(result.plannedDownloads, 1);
});
