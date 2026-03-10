import{f as g,g as l,m as d,a1 as v,h as b,i as h,k as y,a$ as C}from"./index-DJbcn0rV.js";import{f as $}from"./text-BFgT2WD4.js";import{j as _,k as m,v as z,c as a}from"./vue-vendor-J9QZ-CeD.js";const R=g("icon",`
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
`,[l("color-transition",{transition:"color .3s var(--n-bezier)"}),l("depth",{color:"var(--n-color)"},[d("svg",{opacity:"var(--n-opacity)",transition:"opacity .3s var(--n-bezier)"})]),d("svg",{height:"1em",width:"1em"})]),S=Object.assign(Object.assign({},h.props),{depth:[String,Number],size:[Number,String],color:String,component:[Object,Function]}),w=_({_n_icon__:!0,name:"Icon",inheritAttrs:!1,props:S,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:t}=b(e),s=h("Icon","-icon",R,C,e,o),r=a(()=>{const{depth:i}=e,{common:{cubicBezierEaseInOut:c},self:u}=s.value;if(i!==void 0){const{color:f,[`opacity${i}Depth`]:p}=u;return{"--n-bezier":c,"--n-color":f,"--n-opacity":p}}return{"--n-bezier":c,"--n-color":"","--n-opacity":""}}),n=t?y("icon",a(()=>`${e.depth||"d"}`),r,e):void 0;return{mergedClsPrefix:o,mergedStyle:a(()=>{const{size:i,color:c}=e;return{fontSize:$(i),color:c}}),cssVars:t?void 0:r,themeClass:n?.themeClass,onRender:n?.onRender}},render(){var e;const{$parent:o,depth:t,mergedClsPrefix:s,component:r,onRender:n,themeClass:i}=this;return!((e=o?.$options)===null||e===void 0)&&e._n_icon__&&v("icon","don't wrap `n-icon` inside `n-icon`"),n?.(),m("i",z(this.$attrs,{role:"img",class:[`${s}-icon`,i,{[`${s}-icon--depth`]:t,[`${s}-icon--color-transition`]:t!==void 0}],style:[this.cssVars,this.mergedStyle]}),r?m(r):this.$slots)}});export{w as N};
