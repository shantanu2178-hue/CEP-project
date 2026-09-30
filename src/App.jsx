import { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import TestLibrary from './pages/TestLibrary';
import TestDetail from './pages/TestDetail';
import ReportCase from './pages/ReportCase';
import EvidenceVault from './pages/EvidenceVault';
import ClusterMap from './pages/ClusterMap';
import RiskCalculator from './pages/RiskCalculator';
import AdminConfig from './pages/AdminConfig';

const routes = {
  '/': Home,
  '/tests': TestLibrary,
  '/test/:id': TestDetail,
  '/report': ReportCase,
  '/vault': EvidenceVault,
  '/map': ClusterMap,
  '/risk': RiskCalculator,
  '/admin': AdminConfig,
};

function getRoute(path) {
  if (path.startsWith('/test/')) {
    const id = path.replace('/test/', '');
    return { component: TestDetail, props: { testId: id } };
  }
  const component = routes[path] || Home;
  return { component, props: {} };
}

export default function App() {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const onHashChange = () => {
      setPath(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to) => {
    window.location.hash = to;
  }, []);

  const { component: PageComponent, props } = getRoute(path);

  return (
    <Layout navigate={navigate} currentPath={path}>
      <PageComponent navigate={navigate} {...props} />
    </Layout  >
  );
}
