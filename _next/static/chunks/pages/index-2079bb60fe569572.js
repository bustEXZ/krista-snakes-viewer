(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5301:function(e,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(3676)}])},1551:function(e,r,t){"use strict";function n(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function o(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,o,a=[],i=!0,u=!1;try{for(t=t.call(e);!(i=(n=t.next()).done)&&(a.push(n.value),!r||a.length!==r);i=!0);}catch(l){u=!0,o=l}finally{try{i||null==t.return||t.return()}finally{if(u)throw o}}return a}}(e,r)||function(e,r){if(!e)return;if("string"===typeof e)return n(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return n(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}r.default=void 0;var a,i=(a=t(7294))&&a.__esModule?a:{default:a},u=t(1003),l=t(880),c=t(9246);var f={};function s(e,r,t,n){if(e&&u.isLocalURL(r)){e.prefetch(r,t,n).catch((function(e){0}));var o=n&&"undefined"!==typeof n.locale?n.locale:e&&e.locale;f[r+"%"+t+(o?"%"+o:"")]=!0}}var d=function(e){var r,t=!1!==e.prefetch,n=l.useRouter(),a=i.default.useMemo((function(){var r=o(u.resolveHref(n,e.href,!0),2),t=r[0],a=r[1];return{href:t,as:e.as?u.resolveHref(n,e.as):a||t}}),[n,e.href,e.as]),d=a.href,p=a.as,v=e.children,y=e.replace,h=e.shallow,g=e.scroll,m=e.locale;"string"===typeof v&&(v=i.default.createElement("a",null,v));var b=(r=i.default.Children.only(v))&&"object"===typeof r&&r.ref,w=o(c.useIntersection({rootMargin:"200px"}),2),x=w[0],j=w[1],E=i.default.useCallback((function(e){x(e),b&&("function"===typeof b?b(e):"object"===typeof b&&(b.current=e))}),[b,x]);i.default.useEffect((function(){var e=j&&t&&u.isLocalURL(d),r="undefined"!==typeof m?m:n&&n.locale,o=f[d+"%"+p+(r?"%"+r:"")];e&&!o&&s(n,d,p,{locale:r})}),[p,d,j,m,t,n]);var _={ref:E,onClick:function(e){r.props&&"function"===typeof r.props.onClick&&r.props.onClick(e),e.defaultPrevented||function(e,r,t,n,o,a,i,l){("A"!==e.currentTarget.nodeName.toUpperCase()||!function(e){var r=e.currentTarget.target;return r&&"_self"!==r||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&u.isLocalURL(t))&&(e.preventDefault(),r[o?"replace":"push"](t,n,{shallow:a,locale:l,scroll:i}))}(e,n,d,p,y,h,g,m)},onMouseEnter:function(e){r.props&&"function"===typeof r.props.onMouseEnter&&r.props.onMouseEnter(e),u.isLocalURL(d)&&s(n,d,p,{priority:!0})}};if(e.passHref||"a"===r.type&&!("href"in r.props)){var C="undefined"!==typeof m?m:n&&n.locale,I=n&&n.isLocaleDomain&&u.getDomainLocale(p,C,n&&n.locales,n&&n.domainLocales);_.href=I||u.addBasePath(u.addLocale(p,C,n&&n.defaultLocale))}return i.default.cloneElement(r,_)};r.default=d},9246:function(e,r,t){"use strict";function n(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function o(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,o,a=[],i=!0,u=!1;try{for(t=t.call(e);!(i=(n=t.next()).done)&&(a.push(n.value),!r||a.length!==r);i=!0);}catch(l){u=!0,o=l}finally{try{i||null==t.return||t.return()}finally{if(u)throw o}}return a}}(e,r)||function(e,r){if(!e)return;if("string"===typeof e)return n(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return n(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}Object.defineProperty(r,"__esModule",{value:!0}),r.useIntersection=function(e){var r=e.rootRef,t=e.rootMargin,n=e.disabled||!u,f=a.useRef(),s=o(a.useState(!1),2),d=s[0],p=s[1],v=o(a.useState(r?r.current:null),2),y=v[0],h=v[1],g=a.useCallback((function(e){f.current&&(f.current(),f.current=void 0),n||d||e&&e.tagName&&(f.current=function(e,r,t){var n=function(e){var r,t={root:e.root||null,margin:e.rootMargin||""},n=c.find((function(e){return e.root===t.root&&e.margin===t.margin}));n?r=l.get(n):(r=l.get(t),c.push(t));if(r)return r;var o=new Map,a=new IntersectionObserver((function(e){e.forEach((function(e){var r=o.get(e.target),t=e.isIntersecting||e.intersectionRatio>0;r&&t&&r(t)}))}),e);return l.set(t,r={id:t,observer:a,elements:o}),r}(t),o=n.id,a=n.observer,i=n.elements;return i.set(e,r),a.observe(e),function(){if(i.delete(e),a.unobserve(e),0===i.size){a.disconnect(),l.delete(o);var r=c.findIndex((function(e){return e.root===o.root&&e.margin===o.margin}));r>-1&&c.splice(r,1)}}}(e,(function(e){return e&&p(e)}),{root:y,rootMargin:t}))}),[n,y,t,d]);return a.useEffect((function(){if(!u&&!d){var e=i.requestIdleCallback((function(){return p(!0)}));return function(){return i.cancelIdleCallback(e)}}}),[d]),a.useEffect((function(){r&&h(r.current)}),[r]),[g,d]};var a=t(7294),i=t(4686),u="undefined"!==typeof IntersectionObserver;var l=new Map,c=[]},3676:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return f}});var n=t(5893),o=t(664),a=(t(7294),t(1664)),i=t(1217),u=t(9074),l=(0,i.Pi)((function(e){var r=e.data,t=e.stage;return(0,n.jsx)("div",{className:"grid grid-cols-5",children:r.map((function(e,r){return(0,n.jsx)(a.default,{href:"/viewer?team=".concat(u.w.currentPlayer.index,"&game=").concat(r,"&stage=").concat(t),children:(0,n.jsx)(o.E.div,{className:"p-2 text-center",whileHover:{scale:1.1,backgroundColor:"#313a49",transition:{duration:.2}},children:r})},e)}))})})),c=t(1409),f=(0,i.Pi)((function(){var e=c.u.games;return(0,n.jsx)("div",{children:(0,n.jsxs)("main",{className:"grid px-12 grid-rows-1 grid-cols-2 gap-3 overflow-auto",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"text-center text-lg",children:"\u0413\u0440\u0443\u043f\u043f\u0430"}),(0,n.jsx)(l,{stage:"groups",data:e.groups})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"text-center text-lg",children:"\u041f\u043b\u0435\u0439\u043e\u0444\u0444"}),(0,n.jsx)(l,{stage:"playoff",data:e.playoff})]})]})})}))},1664:function(e,r,t){e.exports=t(1551)}},function(e){e.O(0,[774,888,179],(function(){return r=5301,e(e.s=r);var r}));var r=e.O();_N_E=r}]);