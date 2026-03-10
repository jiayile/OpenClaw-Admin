import{j as S,k as o,q as C,n as k,c as u,r as x}from"./vue-vendor-J9QZ-CeD.js";import{m as f,f as c,M as $,g as h,af as w,h as T,i as v,k as R,b2 as N,ag as j,a9 as B}from"./index-DJbcn0rV.js";import{u as O}from"./text-BFgT2WD4.js";const P=f([f("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),c("spin-container",`
 position: relative;
 `,[c("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[$()])]),c("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),c("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[h("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),c("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),c("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[h("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),V={small:20,medium:18,large:16},W=Object.assign(Object.assign({},v.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),D=S({name:"Spin",props:W,slots:Object,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:t}=T(e),s=v("Spin","-spin",P,N,e,r),d=u(()=>{const{size:n}=e,{common:{cubicBezierEaseInOut:a},self:m}=s.value,{opacitySpinning:y,color:g,textColor:b}=m,z=typeof n=="number"?j(n):m[B("size",n)];return{"--n-bezier":a,"--n-opacity-spinning":y,"--n-size":z,"--n-color":g,"--n-text-color":b}}),i=t?R("spin",u(()=>{const{size:n}=e;return typeof n=="number"?String(n):n[0]}),d,e):void 0,p=O(e,["spinning","show"]),l=x(!1);return k(n=>{let a;if(p.value){const{delay:m}=e;if(m){a=window.setTimeout(()=>{l.value=!0},m),n(()=>{clearTimeout(a)});return}}l.value=p.value}),{mergedClsPrefix:r,active:l,mergedStrokeWidth:u(()=>{const{strokeWidth:n}=e;if(n!==void 0)return n;const{size:a}=e;return V[typeof a=="number"?"medium":a]}),cssVars:t?void 0:d,themeClass:i?.themeClass,onRender:i?.onRender}},render(){var e,r;const{$slots:t,mergedClsPrefix:s,description:d}=this,i=t.icon&&this.rotate,p=(d||t.description)&&o("div",{class:`${s}-spin-description`},d||((e=t.description)===null||e===void 0?void 0:e.call(t))),l=t.icon?o("div",{class:[`${s}-spin-body`,this.themeClass]},o("div",{class:[`${s}-spin`,i&&`${s}-spin--rotate`],style:t.default?"":this.cssVars},t.icon()),p):o("div",{class:[`${s}-spin-body`,this.themeClass]},o(w,{clsPrefix:s,style:t.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${s}-spin`}),p);return(r=this.onRender)===null||r===void 0||r.call(this),t.default?o("div",{class:[`${s}-spin-container`,this.themeClass],style:this.cssVars},o("div",{class:[`${s}-spin-content`,this.active&&`${s}-spin-content--spinning`,this.contentClass],style:this.contentStyle},t),o(C,{name:"fade-in-transition"},{default:()=>this.active?l:null})):l}});export{D as N};
