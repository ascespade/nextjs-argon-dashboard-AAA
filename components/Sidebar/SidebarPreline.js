import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSidebar } from "contexts/SidebarContext";

function SidebarPreline({ routes, logo }) {
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [collapseShow, setCollapseShow] = React.useState(false);

  return (
    <>
      <nav className={`hs-sidebar hs-sidebar-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 lg:z-50 lg:bg-white lg:border-e lg:border-gray-200 lg:pt-0 lg:pb-0 lg:overflow-y-auto lg:flex lg:flex-col lg:fixed lg:top-0 lg:start-0 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex items-center justify-between gap-x-3 py-2 px-4">
          {!isCollapsed && (
            <Link href={logo.innerLink}>
              <img
                className="flex-none size-8"
                src={logo.imgSrc}
                alt={logo.imgAlt}
              />
            </Link>
          )}
          {isCollapsed && (
            <Link href={logo.innerLink} className="flex justify-center w-full">
              <img
                className="flex-none size-8"
                src={logo.imgSrc}
                alt={logo.imgAlt}
              />
            </Link>
          )}
          <button
            type="button"
            className="hs-sidebar-toggle flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-300 lg:hidden"
            onClick={() => setCollapseShow(!collapseShow)}
          >
            <svg
              className="flex-none size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <button
            type="button"
            className="hidden lg:flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-300"
            onClick={toggleSidebar}
          >
            <svg
              className="flex-none size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          </button>
        </div>

        <div className="hs-sidebar-scrollbar-y hs-sidebar-scrollbar-x hs-sidebar-scrollbar--hover">
          <ul className="flex flex-col flex-wrap gap-2 p-4">
            {routes.map((prop, key) => {
              if (prop.layout === "/admin") {
                return (
                  <li key={key}>
                    <Link
                      href={prop.layout + prop.path}
                      className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 ${
                        router.route === prop.layout + prop.path
                          ? "bg-gray-100 dark:bg-neutral-700"
                          : ""
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? prop.name : ''}
                    >
                      {prop.icon && (
                        <i className={`${prop.icon} flex-shrink-0 size-4`} />
                      )}
                      {!isCollapsed && prop.name}
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {collapseShow && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setCollapseShow(false)}
        >
          <div className="fixed inset-0 bg-gray-900/50" />
          <div className="relative flex flex-col w-64 h-full bg-white border-e border-gray-200">
            <div className="flex items-center justify-between gap-x-3 py-2 px-4">
              <Link href={logo.innerLink}>
                <img
                  className="flex-none size-8"
                  src={logo.imgSrc}
                  alt={logo.imgAlt}
                />
              </Link>
              <button
                type="button"
                className="flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100"
                onClick={() => setCollapseShow(false)}
              >
                <svg
                  className="flex-none size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 6-12 12" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-col flex-wrap gap-2 p-4">
                {routes.map((prop, key) => {
                  if (prop.layout === "/admin") {
                    return (
                      <li key={key}>
                        <Link
                          href={prop.layout + prop.path}
                          className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 ${
                            router.route === prop.layout + prop.path
                              ? "bg-gray-100 dark:bg-neutral-700"
                              : ""
                          }`}
                          onClick={() => setCollapseShow(false)}
                        >
                          {prop.icon && (
                            <i className={`${prop.icon} flex-shrink-0 size-4`} />
                          )}
                          {prop.name}
                        </Link>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarPreline;
