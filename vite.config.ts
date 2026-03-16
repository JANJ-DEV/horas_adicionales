import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Cambiado a Babel
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Configuración del compilador
const ReactCompilerConfig = {};

const vendorChunkGroups: Array<[string, string[]]> = [
  ["react-core", ["react", "react-dom"]],
  ["react-router", ["react-router"]],
  ["ui-vendor", ["react-icons", "react-toastify"]],
];

const getNodeModulesPackageName = (id: string) => {
  const normalizedId = id.replace(/\\/g, "/");
  const nodeModulesIndex = normalizedId.lastIndexOf("/node_modules/");

  if (nodeModulesIndex === -1) return null;

  const packagePath = normalizedId.slice(nodeModulesIndex + "/node_modules/".length);
  const segments = packagePath.split("/");

  if (segments[0]?.startsWith("@") && segments[1]) {
    return `${segments[0]}/${segments[1]}`;
  }

  return segments[0] ?? null;
};

const resolveVendorChunk = (id: string) => {
  if (!id.includes("node_modules")) return undefined;

  const packageName = getNodeModulesPackageName(id);
  if (!packageName) return "vendor";

  for (const [chunkName, packages] of vendorChunkGroups) {
    if (packages.some((pkg) => packageName === pkg || packageName.startsWith(`${pkg}/`))) {
      return chunkName;
    }
  }

  return undefined;
};

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: resolveVendorChunk,
      },
    },
  },
});
