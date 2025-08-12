// lib/migrations.js
// קובץ עזר למיגרציה מ-React ל-Next.js

/**
 * רשימת השינויים הנדרשים בקבצים:
 * 
 * 1. React Router → Next.js Navigation
 *    - import { useNavigate } from 'react-router-dom' → import { useRouter } from 'next/navigation'
 *    - import { Link } from 'react-router-dom' → import Link from 'next/link'
 *    - navigate('/path') → router.push('/path')
 *    - useParams() → use params prop from page
 * 
 * 2. Images
 *    - <img src={...} /> → import Image from 'next/image'
 *    - Add width and height props
 * 
 * 3. Client Components
 *    - Add 'use client' at the top of files that use:
 *      - useState, useEffect, useContext
 *      - onClick, onChange, onSubmit
 *      - Browser APIs (window, document, localStorage)
 * 
 * 4. API Calls
 *    - Absolute URLs: axios.get('/api/...') → axios.get(`${process.env.NEXT_PUBLIC_API_URL}/...`)
 *    - Or use the proxy: axios.get('/api/proxy/...')
 * 
 * 5. CSS Imports
 *    - import './styles.css' → Only in layout.js or convert to CSS modules
 */

// רשימת קומפוננטות שצריכות 'use client'
export const clientComponents = [
  'SearchPanel',
  'SearchResults',
  'SearchSuggestions',
  'ProductCard',
  'ProductDetailsModal',
  'ProfileCircle',
  'GoogleAuthButton',
  'PrivateRoute',
  'ProductViewerWrapper',
  'ProductsManager',
  'SearchConnector',
  'VendorInfoCard',
  'QuestionsList',
  'CommentSection',
];

// רשימת קומפוננטות שיכולות להיות Server Components
export const serverComponents = [
  'Layout',
  'ProductFeed',
  'VendorProductsPage',
  'ProductDetails',
  'FavoritesPage',
];

// פונקציה לבדיקה אם קומפוננטה צריכה להיות Client Component
export function needsUseClient(fileContent) {
  const clientIndicators = [
    'useState',
    'useEffect',
    'useContext',
    'useReducer',
    'useCallback',
    'useMemo',
    'onClick',
    'onChange',
    'onSubmit',
    'window.',
    'document.',
    'localStorage',
    'sessionStorage',
    'navigator.',
  ];
  
  return clientIndicators.some(indicator => fileContent.includes(indicator));
}

// פונקציה להחלפת imports
export function updateImports(fileContent) {
  let updated = fileContent;
  
  // React Router → Next.js
  updated = updated.replace(
    /import\s+{\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"]/g,
    "import { useRouter } from 'next/navigation'"
  );
  
  updated = updated.replace(
    /import\s+{\s*Link\s*}\s+from\s+['"]react-router-dom['"]/g,
    "import Link from 'next/link'"
  );
  
  updated = updated.replace(
    /import\s+{\s*useParams\s*}\s+from\s+['"]react-router-dom['"]/g,
    "// useParams - get from page props in Next.js"
  );
  
  updated = updated.replace(
    /import\s+{\s*useLocation\s*}\s+from\s+['"]react-router-dom['"]/g,
    "import { usePathname } from 'next/navigation'"
  );
  
  // Navigate → Router
  updated = updated.replace(
    /const\s+navigate\s*=\s*useNavigate\(\)/g,
    "const router = useRouter()"
  );
  
  updated = updated.replace(
    /navigate\(/g,
    "router.push("
  );
  
  return updated;
}

// פונקציה להחלפת תמונות
export function updateImages(fileContent) {
  let updated = fileContent;
  
  // Add Next Image import if img tags exist
  if (updated.includes('<img') && !updated.includes("from 'next/image'")) {
    updated = "import Image from 'next/image';\n" + updated;
  }
  
  // Replace img tags with Image component
  // This is a simple replacement - might need manual adjustments
  updated = updated.replace(
    /<img\s+src={([^}]+)}\s+alt={([^}]+)}/g,
    '<Image src={$1} alt={$2} width={500} height={500}'
  );
  
  return updated;
}

// פונקציה להוספת 'use client' אם צריך
export function addUseClientDirective(fileContent) {
  if (needsUseClient(fileContent) && !fileContent.includes('use client')) {
    return "'use client';\n\n" + fileContent;
  }
  return fileContent;
}

// פונקציה להחלפת API URLs
export function updateApiUrls(fileContent) {
  let updated = fileContent;
  
  // Update axios baseURL
  updated = updated.replace(
    /axios\.defaults\.baseURL\s*=\s*['"][^'"]+['"]/g,
    "axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL"
  );
  
  // Update API calls
  updated = updated.replace(
    /fetch\(['"]\/api\//g,
    "fetch('/api/proxy/"
  );
  
  updated = updated.replace(
    /axios\.(get|post|put|delete|patch)\(['"]\/(?!api\/proxy)/g,
    "axios.$1('/api/proxy/"
  );
  
  return updated;
}

// פונקציה מרכזית למיגרציה של קובץ
export function migrateFile(fileContent, fileName) {
  let migrated = fileContent;
  
  // Update imports
  migrated = updateImports(migrated);
  
  // Update images
  migrated = updateImages(migrated);
  
  // Update API URLs
  migrated = updateApiUrls(migrated);
  
  // Add 'use client' if needed
  migrated = addUseClientDirective(migrated);
  
  return migrated;
}

// רשימת קבצים שדורשים התאמה ידנית
export const manualAdjustmentFiles = {
  'components/layout/Layout.jsx': 'Convert to Next.js app layout',
  'components/common/PrivateRoute.jsx': 'Convert to middleware',
  'App.jsx': 'Split into different page.js files',
  'main.jsx': 'Move providers to Providers.jsx',
  'contexts/AuthContext.jsx': 'Adapt authentication flow',
};

console.log('Migration helpers loaded. Check manualAdjustmentFiles for files that need manual adjustment.');