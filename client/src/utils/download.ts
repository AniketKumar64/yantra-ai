import { saveAs } from 'file-saver';

// ================= TYPES =================

interface DownloadOptions {
  filename?: string;
  format?: 'jsx' | 'tsx' | 'html' | 'zip';
  includePackageJson?: boolean;
  includeStyles?: boolean;
  projectName?: string;
}

interface ReactProject {
  code: string;
  projectName?: string;
  styles?: string;
}

// ================= JSX DOWNLOAD =================

export const downloadAsJSX = (
  code: string,
  filename: string = 'Component.jsx'
) => {
  const jsxWrapper = `import React from 'react';

export default function App() {
    return (
        <>
${code.split('\n').map(line => `            ${line}`).join('\n')}
        </>
    );
}`;

  const blob = new Blob([jsxWrapper], {
    type: 'text/plain;charset=utf-8',
  });

  saveAs(blob, filename);
};

// ================= TSX DOWNLOAD =================

export const downloadAsTSX = (
  code: string,
  filename: string = 'Component.tsx'
) => {
  const tsxWrapper = `import React from 'react';

interface AppProps {}

const App: React.FC<AppProps> = () => {
    return (
        <>
${code.split('\n').map(line => `            ${line}`).join('\n')}
        </>
    );
};

export default App;`;

  const blob = new Blob([tsxWrapper], {
    type: 'text/plain;charset=utf-8',
  });

  saveAs(blob, filename);
};

// ================= FULL REACT APP (STRUCTURE) =================

export const downloadAsReactApp = (
  code: string,
  projectName: string = 'my-app',
  styles?: string
) => {
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-scripts': '5.0.1',
    },
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject',
    },
    eslintConfig: {
      extends: ['react-app'],
    },
    browserslist: {
      production: ['>0.2%', 'not dead', 'not op_mini all'],
      development: [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version',
      ],
    },
  };

  const appJsx = `import React from 'react';
import './App.css';

export default function App() {
    return (
        <div className="app">
${code.split('\n').map(line => `            ${line}`).join('\n')}
        </div>
    );
}`;

  const appCss =
    styles ||
    `/* Add your styles here */
.app {
  padding: 20px;
  font-family: system-ui, sans-serif;
}`;

  const indexJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  const indexCss = `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}`;

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

  const readme = `# ${projectName}

## Setup

npm install
npm start
`;

  const files = {
    'package.json': JSON.stringify(packageJson, null, 2),
    'src/App.jsx': appJsx,
    'src/App.css': appCss,
    'src/index.jsx': indexJsx,
    'src/index.css': indexCss,
    'public/index.html': indexHtml,
    'README.md': readme,
  };

  const fileList = Object.entries(files)
    .map(
      ([path, content]) =>
        `${path}\n${'─'.repeat(50)}\n${content}\n\n`
    )
    .join('\n');

  const blob = new Blob([fileList], {
    type: 'text/plain;charset=utf-8',
  });

  saveAs(blob, `${projectName}-structure.txt`);

  console.log('React App Structure:', files);

  return files;
};

// ================= HTML DOWNLOAD =================

export const downloadAsHTMLWithReact = (
  code: string,
  filename: string = 'app.html'
) => {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const App = () => (
      <>
${code.split('\n').map(line => `        ${line}`).join('\n')}
      </>
    );

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], {
    type: 'text/html;charset=utf-8',
  });

  saveAs(blob, filename);
};

// ================= NEXT.JS DOWNLOAD =================

export const downloadAsNextJS = (
  code: string,
  filename: string = 'page.jsx'
) => {
  const nextContent = `'use client';

export default function Home() {
  return (
    <main>
${code.split('\n').map(line => `      ${line}`).join('\n')}
    </main>
  );
}`;

  const blob = new Blob([nextContent], {
    type: 'text/plain;charset=utf-8',
  });

  saveAs(blob, filename);
};

// ================= MAIN CONTROLLER =================

export const downloadCode = (
  htmlCode: string,
  options: DownloadOptions = {}
) => {
  const {
    filename = 'component',
    format = 'jsx',
    projectName = 'my-app',
  } = options;

  switch (format) {
    case 'jsx':
      downloadAsJSX(htmlCode, `${filename}.jsx`);
      break;

    case 'tsx':
      downloadAsTSX(htmlCode, `${filename}.tsx`);
      break;

    case 'html':
      downloadAsHTMLWithReact(htmlCode, `${filename}.html`);
      break;

    case 'zip':
      downloadAsReactApp(htmlCode, projectName);
      break;

    default:
      downloadAsJSX(htmlCode, `${filename}.jsx`);
  }
};