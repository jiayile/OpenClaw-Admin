import{f as c,m as i,g as j,l as m,h as y,i as k,k as P,a5 as T,e as _,Z as E,X as H}from"./index-DJbcn0rV.js";import{j as g,k as v,c as p,p as I,t as O,r as S,d as $,z as N,i as V,Q as F,X as M,Z as x}from"./vue-vendor-J9QZ-CeD.js";const A=c("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[i("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),i("a",`
 color: inherit;
 text-decoration: inherit;
 `),c("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[c("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),i("&:not(:last-child)",[j("clickable",[m("link",`
 cursor: pointer;
 `,[i("&:hover",`
 background-color: var(--n-item-color-hover);
 `),i("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),m("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[i("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[c("icon",`
 color: var(--n-item-text-color-hover);
 `)]),i("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[c("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),m("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),i("&:last-child",[m("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[c("icon",`
 color: var(--n-item-text-color-active);
 `)]),m("separator",`
 display: none;
 `)])])]),C=_("n-breadcrumb"),K=Object.assign(Object.assign({},k.props),{separator:{type:String,default:"/"}}),q=g({name:"Breadcrumb",props:K,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:r}=y(e),n=k("Breadcrumb","-breadcrumb",A,T,e,t);I(C,{separatorRef:O(e,"separator"),mergedClsPrefixRef:t});const l=p(()=>{const{common:{cubicBezierEaseInOut:d},self:{separatorColor:u,itemTextColor:a,itemTextColorHover:s,itemTextColorPressed:h,itemTextColorActive:b,fontSize:f,fontWeightActive:B,itemBorderRadius:w,itemColorHover:z,itemColorPressed:R,itemLineHeight:L}}=n.value;return{"--n-font-size":f,"--n-bezier":d,"--n-item-text-color":a,"--n-item-text-color-hover":s,"--n-item-text-color-pressed":h,"--n-item-text-color-active":b,"--n-separator-color":u,"--n-item-color-hover":z,"--n-item-color-pressed":R,"--n-item-border-radius":w,"--n-font-weight-active":B,"--n-item-line-height":L}}),o=r?P("breadcrumb",void 0,l,e):void 0;return{mergedClsPrefix:t,cssVars:r?void 0:l,themeClass:o?.themeClass,onRender:o?.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),v("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},v("ul",null,this.$slots))}});function X(e=E?window:null){const t=()=>{const{hash:l,host:o,hostname:d,href:u,origin:a,pathname:s,port:h,protocol:b,search:f}=e?.location||{};return{hash:l,host:o,hostname:d,href:u,origin:a,pathname:s,port:h,protocol:b,search:f}},r=S(t()),n=()=>{r.value=t()};return $(()=>{e&&(e.addEventListener("popstate",n),e.addEventListener("hashchange",n))}),N(()=>{e&&(e.removeEventListener("popstate",n),e.removeEventListener("hashchange",n))}),r}const Z={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},G=g({name:"BreadcrumbItem",props:Z,slots:Object,setup(e,{slots:t}){const r=V(C,null);if(!r)return()=>null;const{separatorRef:n,mergedClsPrefixRef:l}=r,o=X(),d=p(()=>e.href?"a":"span"),u=p(()=>o.value.href===e.href?"location":null);return()=>{const{value:a}=l;return v("li",{class:[`${a}-breadcrumb-item`,e.clickable&&`${a}-breadcrumb-item--clickable`]},v(d.value,{class:`${a}-breadcrumb-item__link`,"aria-current":u.value,href:e.href,onClick:e.onClick},t),v("span",{class:`${a}-breadcrumb-item__separator`,"aria-hidden":"true"},H(t.separator,()=>{var s;return[(s=e.separator)!==null&&s!==void 0?s:n.value]})))}}}),D={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},J=g({name:"FolderOutline",render:function(t,r){return F(),M("svg",D,r[0]||(r[0]=[x("path",{d:"M440 432H72a40 40 0 0 1-40-40V120a40 40 0 0 1 40-40h75.89a40 40 0 0 1 22.19 6.72l27.84 18.56a40 40 0 0 0 22.19 6.72H440a40 40 0 0 1 40 40v240a40 40 0 0 1-40 40z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),x("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M32 192h448"},null,-1)]))}});export{J as F,q as N,G as a};
