import React from 'react';
import { useRouter } from 'next/router';
import { SidebarProvider, useSidebar } from 'contexts/SidebarContext';
// core components
import AdminNavbar from 'components/Navbars/AdminNavbarPreline.js';
import AdminFooter from 'components/Footers/AdminFooterPreline.tsx';
import Sidebar from 'components/Sidebar/SidebarPreline.js';

import routes from 'routes.js';

function AdminContent(props) {
  // used for checking current route
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  let mainContentRef = React.createRef();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, []);

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.route.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: '/admin/dashboard',
          imgSrc: require('assets/img/brand/nextjs_argon_black.png'),
          imgAlt: '...',
        }}
      />
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'w-full lg:pl-16' : 'w-full lg:pl-64'
        }`}
        ref={mainContentRef}
      >
        <AdminNavbar {...props} brandText={getBrandText()} />
        <main className='py-10'>{props.children}</main>
        <AdminFooter />
      </div>
    </>
  );
}

function AdminPreline(props) {
  return (
    <SidebarProvider>
      <AdminContent {...props} />
    </SidebarProvider>
  );
}

export default AdminPreline;
