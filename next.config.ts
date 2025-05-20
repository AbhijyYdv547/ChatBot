// next.config.ts
import type { NextConfig } from "next";
import path from 'path'; // Import path module for path manipulation

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer, defaultLoaders }) => {
    if (isServer) {
      // Add a specific rule to ignore the problematic PDF file
      // This rule will match the specific PDF file and prevent it from being processed.
      config.module.rules.push({
        test: /\.pdf$/,
        // Ensure this rule only applies to the specific file
        include: [
          path.resolve(__dirname, 'node_modules', 'pdf-parse', 'test', 'data', '05-versions-space.pdf'),
        ],
        use: {
          // A simple loader that doesn't do anything with the file, effectively ignoring it.
          // You might need to install 'raw-loader' or similar if 'ignore-loader' doesn't exist by default
          loader: 'raw-loader', // raw-loader reads file content, but we don't use it.
                               // Best option is often 'file-loader' with emitFile: false.
                               // If 'raw-loader' causes issues, try a more specific "noop" loader or a custom one.
        },
        // IMPORTANT: Prevent the file from being emitted into the build output
        // For file-loader, you'd typically use options: { emitFile: false }
        // For raw-loader, it just treats it as a string, which might be fine.
        // For a true "ignore", you might need a custom loader that returns nothing.
      });

      // Alternatively, a more common pattern for ignoring files:
      // Remove or comment out the above rule if trying this
      config.module.rules.push({
        test: /\.pdf$/,
        // This regex specifically targets the file within pdf-parse's test directory
        // It's crucial to get the path correct.
        // The regex `path.sep` handles cross-platform path separators.
        exclude: /node_modules[\\/]((?!pdf-parse)|(pdf-parse[\\/]test[\\/]data[\\/]05-versions-space\.pdf))/,
        // The above exclude is tricky. Let's try simpler include/exclude for the specific file

        // A more direct way to effectively ignore it by returning an empty module:
        issuer: {
          and: [
            // Ensure this rule only applies when imported from pdf-parse
            // This regex tries to match paths that imply an import from pdf-parse itself.
            /node_modules[\\/]pdf-parse[\\/]/,
          ],
        },
        type: 'javascript/auto', // Ensures it's treated as a JS module
        use: [
          // A custom loader that effectively does nothing
          // You might need to create a simple 'noop-loader.js' file:
          // module.exports = function(source) { return ''; }; // Returns empty string
          // Or find a 'null-loader' equivalent for Next.js 13+
        ],
      });


      // Continue with your externals if they are intended for other purposes,
      // but the rule above is designed to prevent the ENOENT error specifically.
      config.externals = config.externals || {};
      Object.assign(config.externals, {
        'pdf-parse/test/data/05-versions-space.pdf': 'commonjs pdf-parse/test/data/05-versions-space.pdf',
        'pdf-parse/test': 'commonjs pdf-parse/test',
      });
    }
    return config;
  },
};

export default nextConfig;