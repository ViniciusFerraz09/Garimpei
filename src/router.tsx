import { SiteLayout } from "./components/layout/site-layout";
import Home from "./pages/home";
import ProductsPage from "./pages/products";
import CategoryPage from "./pages/category";
import ProductPage from "./pages/product";
import FavoritesPage from "./pages/favorites";
import About from "./pages/about";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import AdminLogin from "./pages/admin/login";
import FirstAccess from "./pages/admin/first-access";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProductNew from "./pages/admin/products/new";
import AdminProductEdit from "./pages/admin/products/edit";
import AdminProductPreview from "./pages/admin/products/preview";
import NotFound from "./pages/NotFound";

export const routers = [
  {
    path: "/",
    name: "home",
    element: (
      <SiteLayout>
        <Home />
      </SiteLayout>
    ),
  },
  {
    path: "/produtos",
    name: "products",
    element: (
      <SiteLayout>
        <ProductsPage />
      </SiteLayout>
    ),
  },
  {
    path: "/categoria/:slug",
    name: "category",
    element: (
      <SiteLayout>
        <CategoryPage />
      </SiteLayout>
    ),
  },
  {
    path: "/produto/:slug",
    name: "product",
    element: (
      <SiteLayout>
        <ProductPage />
      </SiteLayout>
    ),
  },
  {
    path: "/favoritos",
    name: "favorites",
    element: (
      <SiteLayout>
        <FavoritesPage />
      </SiteLayout>
    ),
  },
  {
    path: "/sobre",
    name: "about",
    element: (
      <SiteLayout>
        <About />
      </SiteLayout>
    ),
  },
  {
    path: "/politica-de-privacidade",
    name: "privacy",
    element: (
      <SiteLayout>
        <Privacy />
      </SiteLayout>
    ),
  },
  {
    path: "/termos-de-uso",
    name: "terms",
    element: (
      <SiteLayout>
        <Terms />
      </SiteLayout>
    ),
  },
  {
    path: "/admin/login",
    name: "adminLogin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/primeiro-acesso",
    name: "adminFirstAccess",
    element: <FirstAccess />,
  },
  {
    path: "/admin",
    name: "adminDashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/produtos/novo",
    name: "adminProductNew",
    element: <AdminProductNew />,
  },
  {
    path: "/admin/produtos/:id/editar",
    name: "adminProductEdit",
    element: <AdminProductEdit />,
  },
  {
    path: "/admin/produtos/:id/preview",
    name: "adminProductPreview",
    element: <AdminProductPreview />,
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: (
      <SiteLayout>
        <NotFound />
      </SiteLayout>
    ),
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
