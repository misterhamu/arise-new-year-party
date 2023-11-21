export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NextUI Template",
  description:
    "Create stunning websites, no matter your level of design expertise.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
        label: "Home",
        href: "/",
      },
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "About",
        href: "/about",
      },
  ],
  links: {
    github: "https://github.com/misterhamu",
    website: "https://aristreet.com",
  },
};
