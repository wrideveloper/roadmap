import DefaultTheme from 'vitepress/theme';
import './custom.css';
import ApiLifecycle from './components/ApiLifecycle.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ApiLifecycle', ApiLifecycle);
  }
};
