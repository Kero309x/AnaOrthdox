import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
export default defineConfig([
  ...nextVitals,
  { rules: {
    // v8 intentionally hydrates device-only preferences in mount effects.
    // This exception does not disable hook dependency or hook ordering checks.
    'react-hooks/set-state-in-effect': 'off',
  }},
  { files: ['src/domain/**/*.ts'], rules: { 'no-restricted-imports':['error',{patterns:['@/features/*','@/shared/ui/*','@/data/*','react','next/*']}] } },
  { files: ['src/shared/**/*.ts','src/shared/**/*.tsx'], rules: { 'no-restricted-imports':['error',{patterns:['@/features/*','@/data/*']}] } },
  globalIgnores(['.next/**','test-results/**','playwright-report/**','next-env.d.ts']),
]);
