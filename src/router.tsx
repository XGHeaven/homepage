import React from "react";
import { Navigate, createBrowserRouter, redirect } from "react-router-dom";
import { HomePage } from "./pages/home";
import { BlogPage } from "./pages/blog";
import { ArticlesPage } from "./pages/blog/articles";
import { ArticlePage } from "./pages/blog/article";
import { CategoriesPage } from "./pages/blog/categories";
import { TagsPage } from "./pages/blog/tags";

export const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
    children: [
      {
        path: "",
        element: <Navigate to="/blog/articles/" replace />,
      },
      {
        path: "articles/",
        element: <ArticlesPage />,
      },
      {
        path: "article/:slot/",
        element: <ArticlePage />,
      },
      {
        path: "categories/",
        element: <CategoriesPage />,
      },
      {
        path: "tags/",
        element: <TagsPage />,
      },
    ],
  },
]);
