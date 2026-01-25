/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import App from './App';
import ProjectPage from './pages/ProjectPage';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/project/:slug" component={ProjectPage} />
    </Router>
  ),
  root
);
