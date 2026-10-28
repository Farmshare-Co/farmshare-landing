import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NETWORK_META_DESCRIPTION, NETWORK_ORG_DESCRIPTION } from './src/lib/networkStats.ts';

// index.html keeps placeholders so a stats refresh does not require editing
// the HTML by hand. Crawlers read the built file, after this replacement.
function networkStatsMeta() {
  return {
    name: 'network-stats-meta',
    transformIndexHtml(html: string) {
      if (!html.includes('__FS_NETWORK_DESCRIPTION__') && !html.includes('__FS_ORG_DESCRIPTION__')) {
        return html;
      }
      const out = html
        .replaceAll('__FS_NETWORK_DESCRIPTION__', NETWORK_META_DESCRIPTION)
        .replaceAll('__FS_ORG_DESCRIPTION__', NETWORK_ORG_DESCRIPTION);
      if (out.includes('__FS_NETWORK_DESCRIPTION__') || out.includes('__FS_ORG_DESCRIPTION__')) {
        throw new Error('network stats placeholder left in index.html');
      }
      return out;
    },
  };
}

export default defineConfig({
  plugins: [react(), networkStatsMeta()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});