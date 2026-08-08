import { createContext } from 'react';

// Lets TRPanelPage's header burger reach the Sidebar's off-canvas drawer
// without every page component having to thread the prop through.
const MobileNavContext = createContext({ toggleMobileNav: () => {} });

export default MobileNavContext;
