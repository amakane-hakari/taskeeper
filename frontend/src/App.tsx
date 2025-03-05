import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { store } from '@/store';
import { AppRoutes } from '@/router';
import { messages } from '@/i18n/config';
import { selectLocale } from '@/features/ui/uiSlice';
import { ThemeProvider } from '@/features/ui/components/ThemeProvider';
import 'sanitize.css';
import '@/App.css';

function AppContent() {
  const locale = useSelector(selectLocale);

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>{AppRoutes}</Routes>
        </BrowserRouter>
      </ThemeProvider>
    </IntlProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
