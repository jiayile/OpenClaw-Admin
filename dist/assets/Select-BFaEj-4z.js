import{c as _,r as I,p as dt,j as se,i as vt,k as c,v as mn,d as Le,e as yn,f as wn,t as te,x as gt,l as xn,w as xe,b as zt,q as Mt,F as Cn,n as Sn,B as Rn,D as Tn}from"./vue-vendor-J9QZ-CeD.js";import{v as Ce,V as mt,ad as ut,aP as _t,ag as Be,b4 as tt,f as K,l as H,m as de,n as At,h as Xe,i as pe,k as Ye,b5 as Fn,a9 as ve,r as Oe,g as re,p as ct,O as Bt,F as yt,af as On,S as kn,X as Pn,a2 as Et,b6 as In,aV as Ee,b7 as zn,b8 as Mn,b9 as wt,a3 as _n,T as An,ba as Bn,bb as En,bc as Nn,o as ce}from"./index-DJbcn0rV.js";import{c as Nt,b as Ge,i as bt,d as Ln,N as $n,B as Dn,V as Kn,a as Vn,u as ft}from"./Popover-DQsLZc57.js";import{N as Wn}from"./Suffix-B8Km6vUZ.js";import{N as nt}from"./Tag-DdcemRlA.js";import{b as jn}from"./next-frame-once-C5Ksf8W7.js";import{a as Lt,u as xt}from"./use-locale-R-RwrN3Y.js";import{h as Ne}from"./happens-in-CM8LO42l.js";import{u as Hn}from"./text-BFgT2WD4.js";function Ct(e){return e&-e}class $t{constructor(t,n){this.l=t,this.min=n;const o=new Array(t+1);for(let i=0;i<t+1;++i)o[i]=0;this.ft=o}add(t,n){if(n===0)return;const{l:o,ft:i}=this;for(t+=1;t<=o;)i[t]+=n,t+=Ct(t)}get(t){return this.sum(t+1)-this.sum(t)}sum(t){if(t===void 0&&(t=this.l),t<=0)return 0;const{ft:n,min:o,l:i}=this;if(t>i)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let s=t*o;for(;t>0;)s+=n[t],t-=Ct(t);return s}getBound(t){let n=0,o=this.l;for(;o>n;){const i=Math.floor((n+o)/2),s=this.sum(i);if(s>t){o=i;continue}else if(s<t){if(n===i)return this.sum(n+1)<=t?n+1:i;n=i}else return i}return n}}let He;function Gn(){return typeof document>"u"?!1:(He===void 0&&("matchMedia"in window?He=window.matchMedia("(pointer:coarse)").matches:He=!1),He)}let ot;function St(){return typeof document>"u"?1:(ot===void 0&&(ot="chrome"in window?window.devicePixelRatio:1),ot)}const Dt="VVirtualListXScroll";function Un({columnsRef:e,renderColRef:t,renderItemWithColsRef:n}){const o=I(0),i=I(0),s=_(()=>{const u=e.value;if(u.length===0)return null;const d=new $t(u.length,0);return u.forEach((b,S)=>{d.add(S,b.width)}),d}),r=Ce(()=>{const u=s.value;return u!==null?Math.max(u.getBound(i.value)-1,0):0}),a=u=>{const d=s.value;return d!==null?d.sum(u):0},h=Ce(()=>{const u=s.value;return u!==null?Math.min(u.getBound(i.value+o.value)+1,e.value.length-1):0});return dt(Dt,{startIndexRef:r,endIndexRef:h,columnsRef:e,renderColRef:t,renderItemWithColsRef:n,getLeft:a}),{listWidthRef:o,scrollLeftRef:i}}const Rt=se({name:"VirtualListRow",props:{index:{type:Number,required:!0},item:{type:Object,required:!0}},setup(){const{startIndexRef:e,endIndexRef:t,columnsRef:n,getLeft:o,renderColRef:i,renderItemWithColsRef:s}=vt(Dt);return{startIndex:e,endIndex:t,columns:n,renderCol:i,renderItemWithCols:s,getLeft:o}},render(){const{startIndex:e,endIndex:t,columns:n,renderCol:o,renderItemWithCols:i,getLeft:s,item:r}=this;if(i!=null)return i({itemIndex:this.index,startColIndex:e,endColIndex:t,allColumns:n,item:r,getLeft:s});if(o!=null){const a=[];for(let h=e;h<=t;++h){const u=n[h];a.push(o({column:u,left:s(h),item:r}))}return a}return null}}),qn=Ge(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[Ge("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[Ge("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),Xn=se({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},columns:{type:Array,default:()=>[]},renderCol:Function,renderItemWithCols:Function,items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const t=_t();qn.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:Nt,ssr:t}),Le(()=>{const{defaultScrollIndex:v,defaultScrollKey:R}=e;v!=null?V({index:v}):R!=null&&V({key:R})});let n=!1,o=!1;yn(()=>{if(n=!1,!o){o=!0;return}V({top:T.value,left:r.value})}),wn(()=>{n=!0,o||(o=!0)});const i=Ce(()=>{if(e.renderCol==null&&e.renderItemWithCols==null||e.columns.length===0)return;let v=0;return e.columns.forEach(R=>{v+=R.width}),v}),s=_(()=>{const v=new Map,{keyField:R}=e;return e.items.forEach(($,G)=>{v.set($[R],G)}),v}),{scrollLeftRef:r,listWidthRef:a}=Un({columnsRef:te(e,"columns"),renderColRef:te(e,"renderCol"),renderItemWithColsRef:te(e,"renderItemWithCols")}),h=I(null),u=I(void 0),d=new Map,b=_(()=>{const{items:v,itemSize:R,keyField:$}=e,G=new $t(v.length,R);return v.forEach((Z,U)=>{const q=Z[$],W=d.get(q);W!==void 0&&G.add(U,W)}),G}),S=I(0),T=I(0),x=Ce(()=>Math.max(b.value.getBound(T.value-ut(e.paddingTop))-1,0)),z=_(()=>{const{value:v}=u;if(v===void 0)return[];const{items:R,itemSize:$}=e,G=x.value,Z=Math.min(G+Math.ceil(v/$+1),R.length-1),U=[];for(let q=G;q<=Z;++q)U.push(R[q]);return U}),V=(v,R)=>{if(typeof v=="number"){p(v,R,"auto");return}const{left:$,top:G,index:Z,key:U,position:q,behavior:W,debounce:Q=!0}=v;if($!==void 0||G!==void 0)p($,G,W);else if(Z!==void 0)F(Z,W,Q);else if(U!==void 0){const g=s.value.get(U);g!==void 0&&F(g,W,Q)}else q==="bottom"?p(0,Number.MAX_SAFE_INTEGER,W):q==="top"&&p(0,0,W)};let O,k=null;function F(v,R,$){const{value:G}=b,Z=G.sum(v)+ut(e.paddingTop);if(!$)h.value.scrollTo({left:0,top:Z,behavior:R});else{O=v,k!==null&&window.clearTimeout(k),k=window.setTimeout(()=>{O=void 0,k=null},16);const{scrollTop:U,offsetHeight:q}=h.value;if(Z>U){const W=G.get(v);Z+W<=U+q||h.value.scrollTo({left:0,top:Z+W-q,behavior:R})}else h.value.scrollTo({left:0,top:Z,behavior:R})}}function p(v,R,$){h.value.scrollTo({left:v,top:R,behavior:$})}function y(v,R){var $,G,Z;if(n||e.ignoreItemResize||ae(R.target))return;const{value:U}=b,q=s.value.get(v),W=U.get(q),Q=(Z=(G=($=R.borderBoxSize)===null||$===void 0?void 0:$[0])===null||G===void 0?void 0:G.blockSize)!==null&&Z!==void 0?Z:R.contentRect.height;if(Q===W)return;Q-e.itemSize===0?d.delete(v):d.set(v,Q-e.itemSize);const w=Q-W;if(w===0)return;U.add(q,w);const j=h.value;if(j!=null){if(O===void 0){const ie=U.sum(q);j.scrollTop>ie&&j.scrollBy(0,w)}else if(q<O)j.scrollBy(0,w);else if(q===O){const ie=U.sum(q);Q+ie>j.scrollTop+j.offsetHeight&&j.scrollBy(0,w)}ne()}S.value++}const N=!Gn();let E=!1;function X(v){var R;(R=e.onScroll)===null||R===void 0||R.call(e,v),(!N||!E)&&ne()}function Y(v){var R;if((R=e.onWheel)===null||R===void 0||R.call(e,v),N){const $=h.value;if($!=null){if(v.deltaX===0&&($.scrollTop===0&&v.deltaY<=0||$.scrollTop+$.offsetHeight>=$.scrollHeight&&v.deltaY>=0))return;v.preventDefault(),$.scrollTop+=v.deltaY/St(),$.scrollLeft+=v.deltaX/St(),ne(),E=!0,jn(()=>{E=!1})}}}function L(v){if(n||ae(v.target))return;if(e.renderCol==null&&e.renderItemWithCols==null){if(v.contentRect.height===u.value)return}else if(v.contentRect.height===u.value&&v.contentRect.width===a.value)return;u.value=v.contentRect.height,a.value=v.contentRect.width;const{onResize:R}=e;R!==void 0&&R(v)}function ne(){const{value:v}=h;v!=null&&(T.value=v.scrollTop,r.value=v.scrollLeft)}function ae(v){let R=v;for(;R!==null;){if(R.style.display==="none")return!0;R=R.parentElement}return!1}return{listHeight:u,listStyle:{overflow:"auto"},keyToIndex:s,itemsStyle:_(()=>{const{itemResizable:v}=e,R=Be(b.value.sum());return S.value,[e.itemsStyle,{boxSizing:"content-box",width:Be(i.value),height:v?"":R,minHeight:v?R:"",paddingTop:Be(e.paddingTop),paddingBottom:Be(e.paddingBottom)}]}),visibleItemsStyle:_(()=>(S.value,{transform:`translateY(${Be(b.value.sum(x.value))})`})),viewportItems:z,listElRef:h,itemsElRef:I(null),scrollTo:V,handleListResize:L,handleListScroll:X,handleListWheel:Y,handleItemResize:y}},render(){const{itemResizable:e,keyField:t,keyToIndex:n,visibleItemsTag:o}=this;return c(mt,{onResize:this.handleListResize},{default:()=>{var i,s;return c("div",mn(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?c("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[c(o,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>{const{renderCol:r,renderItemWithCols:a}=this;return this.viewportItems.map(h=>{const u=h[t],d=n.get(u),b=r!=null?c(Rt,{index:d,item:h}):void 0,S=a!=null?c(Rt,{index:d,item:h}):void 0,T=this.$slots.default({item:h,renderedCols:b,renderedItemWithCols:S,index:d})[0];return e?c(mt,{key:u,onResize:x=>this.handleItemResize(u,x)},{default:()=>T}):(T.key=u,T)})}})]):(s=(i=this.$slots).empty)===null||s===void 0?void 0:s.call(i)])}})}}),he="v-hidden",Yn=Ge("[v-hidden]",{display:"none!important"}),Tt=se({name:"Overflow",props:{getCounter:Function,getTail:Function,updateCounter:Function,onUpdateCount:Function,onUpdateOverflow:Function},setup(e,{slots:t}){const n=I(null),o=I(null);function i(r){const{value:a}=n,{getCounter:h,getTail:u}=e;let d;if(h!==void 0?d=h():d=o.value,!a||!d)return;d.hasAttribute(he)&&d.removeAttribute(he);const{children:b}=a;if(r.showAllItemsBeforeCalculate)for(const F of b)F.hasAttribute(he)&&F.removeAttribute(he);const S=a.offsetWidth,T=[],x=t.tail?u?.():null;let z=x?x.offsetWidth:0,V=!1;const O=a.children.length-(t.tail?1:0);for(let F=0;F<O-1;++F){if(F<0)continue;const p=b[F];if(V){p.hasAttribute(he)||p.setAttribute(he,"");continue}else p.hasAttribute(he)&&p.removeAttribute(he);const y=p.offsetWidth;if(z+=y,T[F]=y,z>S){const{updateCounter:N}=e;for(let E=F;E>=0;--E){const X=O-1-E;N!==void 0?N(X):d.textContent=`${X}`;const Y=d.offsetWidth;if(z-=T[E],z+Y<=S||E===0){V=!0,F=E-1,x&&(F===-1?(x.style.maxWidth=`${S-Y}px`,x.style.boxSizing="border-box"):x.style.maxWidth="");const{onUpdateCount:L}=e;L&&L(X);break}}}}const{onUpdateOverflow:k}=e;V?k!==void 0&&k(!0):(k!==void 0&&k(!1),d.setAttribute(he,""))}const s=_t();return Yn.mount({id:"vueuc/overflow",head:!0,anchorMetaName:Nt,ssr:s}),Le(()=>i({showAllItemsBeforeCalculate:!1})),{selfRef:n,counterRef:o,sync:i}},render(){const{$slots:e}=this;return gt(()=>this.sync({showAllItemsBeforeCalculate:!1})),c("div",{class:"v-overflow",ref:"selfRef"},[xn(e,"default"),e.counter?e.counter():c("span",{style:{display:"inline-block"},ref:"counterRef"}),e.tail?e.tail():null])}});function Kt(e,t){t&&(Le(()=>{const{value:n}=e;n&&tt.registerHandler(n,t)}),xe(e,(n,o)=>{o&&tt.unregisterHandler(o)},{deep:!1}),zt(()=>{const{value:n}=e;n&&tt.unregisterHandler(n)}))}function Ft(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}function it(e){const t=e.filter(n=>n!==void 0);if(t.length!==0)return t.length===1?t[0]:n=>{e.forEach(o=>{o&&o(n)})}}const Zn=se({name:"Checkmark",render(){return c("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},c("g",{fill:"none"},c("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),Jn=se({name:"Empty",render(){return c("svg",{viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg"},c("path",{d:"M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",fill:"currentColor"}),c("path",{d:"M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",fill:"currentColor"}))}}),Qn=se({props:{onFocus:Function,onBlur:Function},setup(e){return()=>c("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}});function Ot(e){return Array.isArray(e)?e:[e]}const ht={STOP:"STOP"};function Vt(e,t){const n=t(e);e.children!==void 0&&n!==ht.STOP&&e.children.forEach(o=>Vt(o,t))}function eo(e,t={}){const{preserveGroup:n=!1}=t,o=[],i=n?r=>{r.isLeaf||(o.push(r.key),s(r.children))}:r=>{r.isLeaf||(r.isGroup||o.push(r.key),s(r.children))};function s(r){r.forEach(i)}return s(e),o}function to(e,t){const{isLeaf:n}=e;return n!==void 0?n:!t(e)}function no(e){return e.children}function oo(e){return e.key}function io(){return!1}function lo(e,t){const{isLeaf:n}=e;return!(n===!1&&!Array.isArray(t(e)))}function ro(e){return e.disabled===!0}function ao(e,t){return e.isLeaf===!1&&!Array.isArray(t(e))}function lt(e){var t;return e==null?[]:Array.isArray(e)?e:(t=e.checkedKeys)!==null&&t!==void 0?t:[]}function rt(e){var t;return e==null||Array.isArray(e)?[]:(t=e.indeterminateKeys)!==null&&t!==void 0?t:[]}function so(e,t){const n=new Set(e);return t.forEach(o=>{n.has(o)||n.add(o)}),Array.from(n)}function uo(e,t){const n=new Set(e);return t.forEach(o=>{n.has(o)&&n.delete(o)}),Array.from(n)}function co(e){return e?.type==="group"}function fo(e){const t=new Map;return e.forEach((n,o)=>{t.set(n.key,o)}),n=>{var o;return(o=t.get(n))!==null&&o!==void 0?o:null}}class ho extends Error{constructor(){super(),this.message="SubtreeNotLoadedError: checking a subtree whose required nodes are not fully loaded."}}function vo(e,t,n,o){return Ue(t.concat(e),n,o,!1)}function go(e,t){const n=new Set;return e.forEach(o=>{const i=t.treeNodeMap.get(o);if(i!==void 0){let s=i.parent;for(;s!==null&&!(s.disabled||n.has(s.key));)n.add(s.key),s=s.parent}}),n}function bo(e,t,n,o){const i=Ue(t,n,o,!1),s=Ue(e,n,o,!0),r=go(e,n),a=[];return i.forEach(h=>{(s.has(h)||r.has(h))&&a.push(h)}),a.forEach(h=>i.delete(h)),i}function at(e,t){const{checkedKeys:n,keysToCheck:o,keysToUncheck:i,indeterminateKeys:s,cascade:r,leafOnly:a,checkStrategy:h,allowNotLoaded:u}=e;if(!r)return o!==void 0?{checkedKeys:so(n,o),indeterminateKeys:Array.from(s)}:i!==void 0?{checkedKeys:uo(n,i),indeterminateKeys:Array.from(s)}:{checkedKeys:Array.from(n),indeterminateKeys:Array.from(s)};const{levelTreeNodeMap:d}=t;let b;i!==void 0?b=bo(i,n,t,u):o!==void 0?b=vo(o,n,t,u):b=Ue(n,t,u,!1);const S=h==="parent",T=h==="child"||a,x=b,z=new Set,V=Math.max.apply(null,Array.from(d.keys()));for(let O=V;O>=0;O-=1){const k=O===0,F=d.get(O);for(const p of F){if(p.isLeaf)continue;const{key:y,shallowLoaded:N}=p;if(T&&N&&p.children.forEach(L=>{!L.disabled&&!L.isLeaf&&L.shallowLoaded&&x.has(L.key)&&x.delete(L.key)}),p.disabled||!N)continue;let E=!0,X=!1,Y=!0;for(const L of p.children){const ne=L.key;if(!L.disabled){if(Y&&(Y=!1),x.has(ne))X=!0;else if(z.has(ne)){X=!0,E=!1;break}else if(E=!1,X)break}}E&&!Y?(S&&p.children.forEach(L=>{!L.disabled&&x.has(L.key)&&x.delete(L.key)}),x.add(y)):X&&z.add(y),k&&T&&x.has(y)&&x.delete(y)}}return{checkedKeys:Array.from(x),indeterminateKeys:Array.from(z)}}function Ue(e,t,n,o){const{treeNodeMap:i,getChildren:s}=t,r=new Set,a=new Set(e);return e.forEach(h=>{const u=i.get(h);u!==void 0&&Vt(u,d=>{if(d.disabled)return ht.STOP;const{key:b}=d;if(!r.has(b)&&(r.add(b),a.add(b),ao(d.rawNode,s))){if(o)return ht.STOP;if(!n)throw new ho}})}),a}function po(e,{includeGroup:t=!1,includeSelf:n=!0},o){var i;const s=o.treeNodeMap;let r=e==null?null:(i=s.get(e))!==null&&i!==void 0?i:null;const a={keyPath:[],treeNodePath:[],treeNode:r};if(r?.ignored)return a.treeNode=null,a;for(;r;)!r.ignored&&(t||!r.isGroup)&&a.treeNodePath.push(r),r=r.parent;return a.treeNodePath.reverse(),n||a.treeNodePath.pop(),a.keyPath=a.treeNodePath.map(h=>h.key),a}function mo(e){if(e.length===0)return null;const t=e[0];return t.isGroup||t.ignored||t.disabled?t.getNext():t}function yo(e,t){const n=e.siblings,o=n.length,{index:i}=e;return t?n[(i+1)%o]:i===n.length-1?null:n[i+1]}function kt(e,t,{loop:n=!1,includeDisabled:o=!1}={}){const i=t==="prev"?wo:yo,s={reverse:t==="prev"};let r=!1,a=null;function h(u){if(u!==null){if(u===e){if(!r)r=!0;else if(!e.disabled&&!e.isGroup){a=e;return}}else if((!u.disabled||o)&&!u.ignored&&!u.isGroup){a=u;return}if(u.isGroup){const d=pt(u,s);d!==null?a=d:h(i(u,n))}else{const d=i(u,!1);if(d!==null)h(d);else{const b=xo(u);b?.isGroup?h(i(b,n)):n&&h(i(u,!0))}}}}return h(e),a}function wo(e,t){const n=e.siblings,o=n.length,{index:i}=e;return t?n[(i-1+o)%o]:i===0?null:n[i-1]}function xo(e){return e.parent}function pt(e,t={}){const{reverse:n=!1}=t,{children:o}=e;if(o){const{length:i}=o,s=n?i-1:0,r=n?-1:i,a=n?-1:1;for(let h=s;h!==r;h+=a){const u=o[h];if(!u.disabled&&!u.ignored)if(u.isGroup){const d=pt(u,t);if(d!==null)return d}else return u}}return null}const Co={getChild(){return this.ignored?null:pt(this)},getParent(){const{parent:e}=this;return e?.isGroup?e.getParent():e},getNext(e={}){return kt(this,"next",e)},getPrev(e={}){return kt(this,"prev",e)}};function So(e,t){const n=t?new Set(t):void 0,o=[];function i(s){s.forEach(r=>{o.push(r),!(r.isLeaf||!r.children||r.ignored)&&(r.isGroup||n===void 0||n.has(r.key))&&i(r.children)})}return i(e),o}function Ro(e,t){const n=e.key;for(;t;){if(t.key===n)return!0;t=t.parent}return!1}function Wt(e,t,n,o,i,s=null,r=0){const a=[];return e.forEach((h,u)=>{var d;const b=Object.create(o);if(b.rawNode=h,b.siblings=a,b.level=r,b.index=u,b.isFirstChild=u===0,b.isLastChild=u+1===e.length,b.parent=s,!b.ignored){const S=i(h);Array.isArray(S)&&(b.children=Wt(S,t,n,o,i,b,r+1))}a.push(b),t.set(b.key,b),n.has(r)||n.set(r,[]),(d=n.get(r))===null||d===void 0||d.push(b)}),a}function To(e,t={}){var n;const o=new Map,i=new Map,{getDisabled:s=ro,getIgnored:r=io,getIsGroup:a=co,getKey:h=oo}=t,u=(n=t.getChildren)!==null&&n!==void 0?n:no,d=t.ignoreEmptyChildren?p=>{const y=u(p);return Array.isArray(y)?y.length?y:null:y}:u,b=Object.assign({get key(){return h(this.rawNode)},get disabled(){return s(this.rawNode)},get isGroup(){return a(this.rawNode)},get isLeaf(){return to(this.rawNode,d)},get shallowLoaded(){return lo(this.rawNode,d)},get ignored(){return r(this.rawNode)},contains(p){return Ro(this,p)}},Co),S=Wt(e,o,i,b,d);function T(p){if(p==null)return null;const y=o.get(p);return y&&!y.isGroup&&!y.ignored?y:null}function x(p){if(p==null)return null;const y=o.get(p);return y&&!y.ignored?y:null}function z(p,y){const N=x(p);return N?N.getPrev(y):null}function V(p,y){const N=x(p);return N?N.getNext(y):null}function O(p){const y=x(p);return y?y.getParent():null}function k(p){const y=x(p);return y?y.getChild():null}const F={treeNodes:S,treeNodeMap:o,levelTreeNodeMap:i,maxLevel:Math.max(...i.keys()),getChildren:d,getFlattenedNodes(p){return So(S,p)},getNode:T,getPrev:z,getNext:V,getParent:O,getChild:k,getFirstAvailableNode(){return mo(S)},getPath(p,y={}){return po(p,y,F)},getCheckedKeys(p,y={}){const{cascade:N=!0,leafOnly:E=!1,checkStrategy:X="all",allowNotLoaded:Y=!1}=y;return at({checkedKeys:lt(p),indeterminateKeys:rt(p),cascade:N,leafOnly:E,checkStrategy:X,allowNotLoaded:Y},F)},check(p,y,N={}){const{cascade:E=!0,leafOnly:X=!1,checkStrategy:Y="all",allowNotLoaded:L=!1}=N;return at({checkedKeys:lt(y),indeterminateKeys:rt(y),keysToCheck:p==null?[]:Ot(p),cascade:E,leafOnly:X,checkStrategy:Y,allowNotLoaded:L},F)},uncheck(p,y,N={}){const{cascade:E=!0,leafOnly:X=!1,checkStrategy:Y="all",allowNotLoaded:L=!1}=N;return at({checkedKeys:lt(y),indeterminateKeys:rt(y),keysToUncheck:p==null?[]:Ot(p),cascade:E,leafOnly:X,checkStrategy:Y,allowNotLoaded:L},F)},getNonLeafKeys(p={}){return eo(S,p)}};return F}const Fo=K("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[H("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[de("+",[H("description",`
 margin-top: 8px;
 `)])]),H("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),H("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),Oo=Object.assign(Object.assign({},pe.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:"medium"},renderIcon:Function}),ko=se({name:"Empty",props:Oo,slots:Object,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:n,mergedComponentPropsRef:o}=Xe(e),i=pe("Empty","-empty",Fo,Fn,e,t),{localeRef:s}=Lt("Empty"),r=_(()=>{var d,b,S;return(d=e.description)!==null&&d!==void 0?d:(S=(b=o?.value)===null||b===void 0?void 0:b.Empty)===null||S===void 0?void 0:S.description}),a=_(()=>{var d,b;return((b=(d=o?.value)===null||d===void 0?void 0:d.Empty)===null||b===void 0?void 0:b.renderIcon)||(()=>c(Jn,null))}),h=_(()=>{const{size:d}=e,{common:{cubicBezierEaseInOut:b},self:{[ve("iconSize",d)]:S,[ve("fontSize",d)]:T,textColor:x,iconColor:z,extraTextColor:V}}=i.value;return{"--n-icon-size":S,"--n-font-size":T,"--n-bezier":b,"--n-text-color":x,"--n-icon-color":z,"--n-extra-text-color":V}}),u=n?Ye("empty",_(()=>{let d="";const{size:b}=e;return d+=b[0],d}),h,e):void 0;return{mergedClsPrefix:t,mergedRenderIcon:a,localizedDescription:_(()=>r.value||s.value.description),cssVars:n?void 0:h,themeClass:u?.themeClass,onRender:u?.onRender}},render(){const{$slots:e,mergedClsPrefix:t,onRender:n}=this;return n?.(),c("div",{class:[`${t}-empty`,this.themeClass],style:this.cssVars},this.showIcon?c("div",{class:`${t}-empty__icon`},e.icon?e.icon():c(At,{clsPrefix:t},{default:this.mergedRenderIcon})):null,this.showDescription?c("div",{class:`${t}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?c("div",{class:`${t}-empty__extra`},e.extra()):null)}}),Pt=se({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:t,labelFieldRef:n,nodePropsRef:o}=vt(bt);return{labelField:n,nodeProps:o,renderLabel:e,renderOption:t}},render(){const{clsPrefix:e,renderLabel:t,renderOption:n,nodeProps:o,tmNode:{rawNode:i}}=this,s=o?.(i),r=t?t(i,!1):Oe(i[this.labelField],i,!1),a=c("div",Object.assign({},s,{class:[`${e}-base-select-group-header`,s?.class]}),r);return i.render?i.render({node:a,option:i}):n?n({node:a,option:i,selected:!1}):a}});function Po(e,t){return c(Mt,{name:"fade-in-scale-up-transition"},{default:()=>e?c(At,{clsPrefix:t,class:`${t}-base-select-option__check`},{default:()=>c(Zn)}):null})}const It=se({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:t,pendingTmNodeRef:n,multipleRef:o,valueSetRef:i,renderLabelRef:s,renderOptionRef:r,labelFieldRef:a,valueFieldRef:h,showCheckmarkRef:u,nodePropsRef:d,handleOptionClick:b,handleOptionMouseEnter:S}=vt(bt),T=Ce(()=>{const{value:O}=n;return O?e.tmNode.key===O.key:!1});function x(O){const{tmNode:k}=e;k.disabled||b(O,k)}function z(O){const{tmNode:k}=e;k.disabled||S(O,k)}function V(O){const{tmNode:k}=e,{value:F}=T;k.disabled||F||S(O,k)}return{multiple:o,isGrouped:Ce(()=>{const{tmNode:O}=e,{parent:k}=O;return k&&k.rawNode.type==="group"}),showCheckmark:u,nodeProps:d,isPending:T,isSelected:Ce(()=>{const{value:O}=t,{value:k}=o;if(O===null)return!1;const F=e.tmNode.rawNode[h.value];if(k){const{value:p}=i;return p.has(F)}else return O===F}),labelField:a,renderLabel:s,renderOption:r,handleMouseMove:V,handleMouseEnter:z,handleClick:x}},render(){const{clsPrefix:e,tmNode:{rawNode:t},isSelected:n,isPending:o,isGrouped:i,showCheckmark:s,nodeProps:r,renderOption:a,renderLabel:h,handleClick:u,handleMouseEnter:d,handleMouseMove:b}=this,S=Po(n,e),T=h?[h(t,n),s&&S]:[Oe(t[this.labelField],t,n),s&&S],x=r?.(t),z=c("div",Object.assign({},x,{class:[`${e}-base-select-option`,t.class,x?.class,{[`${e}-base-select-option--disabled`]:t.disabled,[`${e}-base-select-option--selected`]:n,[`${e}-base-select-option--grouped`]:i,[`${e}-base-select-option--pending`]:o,[`${e}-base-select-option--show-checkmark`]:s}],style:[x?.style||"",t.style||""],onClick:it([u,x?.onClick]),onMouseenter:it([d,x?.onMouseenter]),onMousemove:it([b,x?.onMousemove])}),c("div",{class:`${e}-base-select-option__content`},T));return t.render?t.render({node:z,option:t,selected:n}):a?a({node:z,option:t,selected:n}):z}}),Io=K("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[K("scrollbar",`
 max-height: var(--n-height);
 `),K("virtual-list",`
 max-height: var(--n-height);
 `),K("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[H("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),K("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),K("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),H("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),H("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),H("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),H("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),K("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),K("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[re("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),de("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),de("&:active",`
 color: var(--n-option-text-color-pressed);
 `),re("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),re("pending",[de("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),re("selected",`
 color: var(--n-option-text-color-active);
 `,[de("&::before",`
 background-color: var(--n-option-color-active);
 `),re("pending",[de("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),re("disabled",`
 cursor: not-allowed;
 `,[ct("selected",`
 color: var(--n-option-text-color-disabled);
 `),re("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),H("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[Bt({enterScale:"0.5"})])])]),zo=se({name:"InternalSelectMenu",props:Object.assign(Object.assign({},pe.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:n}=Xe(e),o=Et("InternalSelectMenu",n,t),i=pe("InternalSelectMenu","-internal-select-menu",Io,In,e,te(e,"clsPrefix")),s=I(null),r=I(null),a=I(null),h=_(()=>e.treeMate.getFlattenedNodes()),u=_(()=>fo(h.value)),d=I(null);function b(){const{treeMate:g}=e;let w=null;const{value:j}=e;j===null?w=g.getFirstAvailableNode():(e.multiple?w=g.getNode((j||[])[(j||[]).length-1]):w=g.getNode(j),(!w||w.disabled)&&(w=g.getFirstAvailableNode())),R(w||null)}function S(){const{value:g}=d;g&&!e.treeMate.getNode(g.key)&&(d.value=null)}let T;xe(()=>e.show,g=>{g?T=xe(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?b():S(),gt($)):S()},{immediate:!0}):T?.()},{immediate:!0}),zt(()=>{T?.()});const x=_(()=>ut(i.value.self[ve("optionHeight",e.size)])),z=_(()=>Ee(i.value.self[ve("padding",e.size)])),V=_(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),O=_(()=>{const g=h.value;return g&&g.length===0});function k(g){const{onToggle:w}=e;w&&w(g)}function F(g){const{onScroll:w}=e;w&&w(g)}function p(g){var w;(w=a.value)===null||w===void 0||w.sync(),F(g)}function y(){var g;(g=a.value)===null||g===void 0||g.sync()}function N(){const{value:g}=d;return g||null}function E(g,w){w.disabled||R(w,!1)}function X(g,w){w.disabled||k(w)}function Y(g){var w;Ne(g,"action")||(w=e.onKeyup)===null||w===void 0||w.call(e,g)}function L(g){var w;Ne(g,"action")||(w=e.onKeydown)===null||w===void 0||w.call(e,g)}function ne(g){var w;(w=e.onMousedown)===null||w===void 0||w.call(e,g),!e.focusable&&g.preventDefault()}function ae(){const{value:g}=d;g&&R(g.getNext({loop:!0}),!0)}function v(){const{value:g}=d;g&&R(g.getPrev({loop:!0}),!0)}function R(g,w=!1){d.value=g,w&&$()}function $(){var g,w;const j=d.value;if(!j)return;const ie=u.value(j.key);ie!==null&&(e.virtualScroll?(g=r.value)===null||g===void 0||g.scrollTo({index:ie}):(w=a.value)===null||w===void 0||w.scrollTo({index:ie,elSize:x.value}))}function G(g){var w,j;!((w=s.value)===null||w===void 0)&&w.contains(g.target)&&((j=e.onFocus)===null||j===void 0||j.call(e,g))}function Z(g){var w,j;!((w=s.value)===null||w===void 0)&&w.contains(g.relatedTarget)||(j=e.onBlur)===null||j===void 0||j.call(e,g)}dt(bt,{handleOptionMouseEnter:E,handleOptionClick:X,valueSetRef:V,pendingTmNodeRef:d,nodePropsRef:te(e,"nodeProps"),showCheckmarkRef:te(e,"showCheckmark"),multipleRef:te(e,"multiple"),valueRef:te(e,"value"),renderLabelRef:te(e,"renderLabel"),renderOptionRef:te(e,"renderOption"),labelFieldRef:te(e,"labelField"),valueFieldRef:te(e,"valueField")}),dt(Ln,s),Le(()=>{const{value:g}=a;g&&g.sync()});const U=_(()=>{const{size:g}=e,{common:{cubicBezierEaseInOut:w},self:{height:j,borderRadius:ie,color:Se,groupHeaderTextColor:Re,actionDividerColor:fe,optionTextColorPressed:le,optionTextColor:Te,optionTextColorDisabled:ge,optionTextColorActive:ke,optionOpacityDisabled:Pe,optionCheckColor:Ie,actionTextColor:ze,optionColorPending:me,optionColorActive:ye,loadingColor:Me,loadingSize:_e,optionColorActivePending:Ae,[ve("optionFontSize",g)]:Fe,[ve("optionHeight",g)]:we,[ve("optionPadding",g)]:oe}}=i.value;return{"--n-height":j,"--n-action-divider-color":fe,"--n-action-text-color":ze,"--n-bezier":w,"--n-border-radius":ie,"--n-color":Se,"--n-option-font-size":Fe,"--n-group-header-text-color":Re,"--n-option-check-color":Ie,"--n-option-color-pending":me,"--n-option-color-active":ye,"--n-option-color-active-pending":Ae,"--n-option-height":we,"--n-option-opacity-disabled":Pe,"--n-option-text-color":Te,"--n-option-text-color-active":ke,"--n-option-text-color-disabled":ge,"--n-option-text-color-pressed":le,"--n-option-padding":oe,"--n-option-padding-left":Ee(oe,"left"),"--n-option-padding-right":Ee(oe,"right"),"--n-loading-color":Me,"--n-loading-size":_e}}),{inlineThemeDisabled:q}=e,W=q?Ye("internal-select-menu",_(()=>e.size[0]),U,e):void 0,Q={selfRef:s,next:ae,prev:v,getPendingTmNode:N};return Kt(s,e.onResize),Object.assign({mergedTheme:i,mergedClsPrefix:t,rtlEnabled:o,virtualListRef:r,scrollbarRef:a,itemSize:x,padding:z,flattenedNodes:h,empty:O,virtualListContainer(){const{value:g}=r;return g?.listElRef},virtualListContent(){const{value:g}=r;return g?.itemsElRef},doScroll:F,handleFocusin:G,handleFocusout:Z,handleKeyUp:Y,handleKeyDown:L,handleMouseDown:ne,handleVirtualListResize:y,handleVirtualListScroll:p,cssVars:q?void 0:U,themeClass:W?.themeClass,onRender:W?.onRender},Q)},render(){const{$slots:e,virtualScroll:t,clsPrefix:n,mergedTheme:o,themeClass:i,onRender:s}=this;return s?.(),c("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${n}-base-select-menu`,this.rtlEnabled&&`${n}-base-select-menu--rtl`,i,this.multiple&&`${n}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},yt(e.header,r=>r&&c("div",{class:`${n}-base-select-menu__header`,"data-header":!0,key:"header"},r)),this.loading?c("div",{class:`${n}-base-select-menu__loading`},c(On,{clsPrefix:n,strokeWidth:20})):this.empty?c("div",{class:`${n}-base-select-menu__empty`,"data-empty":!0},Pn(e.empty,()=>[c(ko,{theme:o.peers.Empty,themeOverrides:o.peerOverrides.Empty,size:this.size})])):c(kn,{ref:"scrollbarRef",theme:o.peers.Scrollbar,themeOverrides:o.peerOverrides.Scrollbar,scrollable:this.scrollable,container:t?this.virtualListContainer:void 0,content:t?this.virtualListContent:void 0,onScroll:t?void 0:this.doScroll},{default:()=>t?c(Xn,{ref:"virtualListRef",class:`${n}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:r})=>r.isGroup?c(Pt,{key:r.key,clsPrefix:n,tmNode:r}):r.ignored?null:c(It,{clsPrefix:n,key:r.key,tmNode:r})}):c("div",{class:`${n}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(r=>r.isGroup?c(Pt,{key:r.key,clsPrefix:n,tmNode:r}):c(It,{clsPrefix:n,key:r.key,tmNode:r})))}),yt(e.action,r=>r&&[c("div",{class:`${n}-base-select-menu__action`,"data-action":!0,key:"action"},r),c(Qn,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),Mo=de([K("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[K("base-loading",`
 color: var(--n-loading-color);
 `),K("base-selection-tags","min-height: var(--n-height);"),H("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),H("state-border",`
 z-index: 1;
 border-color: #0000;
 `),K("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[H("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),K("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[H("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),K("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[H("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),K("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),K("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[K("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[H("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),H("render-label",`
 color: var(--n-text-color);
 `)]),ct("disabled",[de("&:hover",[H("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),re("focus",[H("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),re("active",[H("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),K("base-selection-label","background-color: var(--n-color-active);"),K("base-selection-tags","background-color: var(--n-color-active);")])]),re("disabled","cursor: not-allowed;",[H("arrow",`
 color: var(--n-arrow-color-disabled);
 `),K("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[K("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),H("render-label",`
 color: var(--n-text-color-disabled);
 `)]),K("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),K("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),K("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[H("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),H("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>re(`${e}-status`,[H("state-border",`border: var(--n-border-${e});`),ct("disabled",[de("&:hover",[H("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),re("active",[H("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),K("base-selection-label",`background-color: var(--n-color-active-${e});`),K("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),re("focus",[H("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),K("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),K("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[de("&:last-child","padding-right: 0;"),K("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[H("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),_o=se({name:"InternalSelection",props:Object.assign(Object.assign({},pe.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:n}=Xe(e),o=Et("InternalSelection",n,t),i=I(null),s=I(null),r=I(null),a=I(null),h=I(null),u=I(null),d=I(null),b=I(null),S=I(null),T=I(null),x=I(!1),z=I(!1),V=I(!1),O=pe("InternalSelection","-internal-selection",Mo,Mn,e,te(e,"clsPrefix")),k=_(()=>e.clearable&&!e.disabled&&(V.value||e.active)),F=_(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Oe(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),p=_(()=>{const f=e.selectedOption;if(f)return f[e.labelField]}),y=_(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function N(){var f;const{value:C}=i;if(C){const{value:J}=s;J&&(J.style.width=`${C.offsetWidth}px`,e.maxTagCount!=="responsive"&&((f=S.value)===null||f===void 0||f.sync({showAllItemsBeforeCalculate:!1})))}}function E(){const{value:f}=T;f&&(f.style.display="none")}function X(){const{value:f}=T;f&&(f.style.display="inline-block")}xe(te(e,"active"),f=>{f||E()}),xe(te(e,"pattern"),()=>{e.multiple&&gt(N)});function Y(f){const{onFocus:C}=e;C&&C(f)}function L(f){const{onBlur:C}=e;C&&C(f)}function ne(f){const{onDeleteOption:C}=e;C&&C(f)}function ae(f){const{onClear:C}=e;C&&C(f)}function v(f){const{onPatternInput:C}=e;C&&C(f)}function R(f){var C;(!f.relatedTarget||!(!((C=r.value)===null||C===void 0)&&C.contains(f.relatedTarget)))&&Y(f)}function $(f){var C;!((C=r.value)===null||C===void 0)&&C.contains(f.relatedTarget)||L(f)}function G(f){ae(f)}function Z(){V.value=!0}function U(){V.value=!1}function q(f){!e.active||!e.filterable||f.target!==s.value&&f.preventDefault()}function W(f){ne(f)}const Q=I(!1);function g(f){if(f.key==="Backspace"&&!Q.value&&!e.pattern.length){const{selectedOptions:C}=e;C?.length&&W(C[C.length-1])}}let w=null;function j(f){const{value:C}=i;if(C){const J=f.target.value;C.textContent=J,N()}e.ignoreComposition&&Q.value?w=f:v(f)}function ie(){Q.value=!0}function Se(){Q.value=!1,e.ignoreComposition&&v(w),w=null}function Re(f){var C;z.value=!0,(C=e.onPatternFocus)===null||C===void 0||C.call(e,f)}function fe(f){var C;z.value=!1,(C=e.onPatternBlur)===null||C===void 0||C.call(e,f)}function le(){var f,C;if(e.filterable)z.value=!1,(f=u.value)===null||f===void 0||f.blur(),(C=s.value)===null||C===void 0||C.blur();else if(e.multiple){const{value:J}=a;J?.blur()}else{const{value:J}=h;J?.blur()}}function Te(){var f,C,J;e.filterable?(z.value=!1,(f=u.value)===null||f===void 0||f.focus()):e.multiple?(C=a.value)===null||C===void 0||C.focus():(J=h.value)===null||J===void 0||J.focus()}function ge(){const{value:f}=s;f&&(X(),f.focus())}function ke(){const{value:f}=s;f&&f.blur()}function Pe(f){const{value:C}=d;C&&C.setTextContent(`+${f}`)}function Ie(){const{value:f}=b;return f}function ze(){return s.value}let me=null;function ye(){me!==null&&window.clearTimeout(me)}function Me(){e.active||(ye(),me=window.setTimeout(()=>{y.value&&(x.value=!0)},100))}function _e(){ye()}function Ae(f){f||(ye(),x.value=!1)}xe(y,f=>{f||(x.value=!1)}),Le(()=>{Sn(()=>{const f=u.value;f&&(e.disabled?f.removeAttribute("tabindex"):f.tabIndex=z.value?-1:0)})}),Kt(r,e.onResize);const{inlineThemeDisabled:Fe}=e,we=_(()=>{const{size:f}=e,{common:{cubicBezierEaseInOut:C},self:{fontWeight:J,borderRadius:Ze,color:Je,placeholderColor:$e,textColor:De,paddingSingle:Ke,paddingMultiple:Qe,caretColor:et,colorDisabled:Ve,textColorDisabled:be,placeholderColorDisabled:l,colorActive:m,boxShadowFocus:P,boxShadowActive:D,boxShadowHover:A,border:M,borderFocus:B,borderHover:ee,borderActive:ue,arrowColor:Ht,arrowColorDisabled:Gt,loadingColor:Ut,colorActiveWarning:qt,boxShadowFocusWarning:Xt,boxShadowActiveWarning:Yt,boxShadowHoverWarning:Zt,borderWarning:Jt,borderFocusWarning:Qt,borderHoverWarning:en,borderActiveWarning:tn,colorActiveError:nn,boxShadowFocusError:on,boxShadowActiveError:ln,boxShadowHoverError:rn,borderError:an,borderFocusError:sn,borderHoverError:dn,borderActiveError:un,clearColor:cn,clearColorHover:fn,clearColorPressed:hn,clearSize:vn,arrowSize:gn,[ve("height",f)]:bn,[ve("fontSize",f)]:pn}}=O.value,We=Ee(Ke),je=Ee(Qe);return{"--n-bezier":C,"--n-border":M,"--n-border-active":ue,"--n-border-focus":B,"--n-border-hover":ee,"--n-border-radius":Ze,"--n-box-shadow-active":D,"--n-box-shadow-focus":P,"--n-box-shadow-hover":A,"--n-caret-color":et,"--n-color":Je,"--n-color-active":m,"--n-color-disabled":Ve,"--n-font-size":pn,"--n-height":bn,"--n-padding-single-top":We.top,"--n-padding-multiple-top":je.top,"--n-padding-single-right":We.right,"--n-padding-multiple-right":je.right,"--n-padding-single-left":We.left,"--n-padding-multiple-left":je.left,"--n-padding-single-bottom":We.bottom,"--n-padding-multiple-bottom":je.bottom,"--n-placeholder-color":$e,"--n-placeholder-color-disabled":l,"--n-text-color":De,"--n-text-color-disabled":be,"--n-arrow-color":Ht,"--n-arrow-color-disabled":Gt,"--n-loading-color":Ut,"--n-color-active-warning":qt,"--n-box-shadow-focus-warning":Xt,"--n-box-shadow-active-warning":Yt,"--n-box-shadow-hover-warning":Zt,"--n-border-warning":Jt,"--n-border-focus-warning":Qt,"--n-border-hover-warning":en,"--n-border-active-warning":tn,"--n-color-active-error":nn,"--n-box-shadow-focus-error":on,"--n-box-shadow-active-error":ln,"--n-box-shadow-hover-error":rn,"--n-border-error":an,"--n-border-focus-error":sn,"--n-border-hover-error":dn,"--n-border-active-error":un,"--n-clear-size":vn,"--n-clear-color":cn,"--n-clear-color-hover":fn,"--n-clear-color-pressed":hn,"--n-arrow-size":gn,"--n-font-weight":J}}),oe=Fe?Ye("internal-selection",_(()=>e.size[0]),we,e):void 0;return{mergedTheme:O,mergedClearable:k,mergedClsPrefix:t,rtlEnabled:o,patternInputFocused:z,filterablePlaceholder:F,label:p,selected:y,showTagsPanel:x,isComposing:Q,counterRef:d,counterWrapperRef:b,patternInputMirrorRef:i,patternInputRef:s,selfRef:r,multipleElRef:a,singleElRef:h,patternInputWrapperRef:u,overflowRef:S,inputTagElRef:T,handleMouseDown:q,handleFocusin:R,handleClear:G,handleMouseEnter:Z,handleMouseLeave:U,handleDeleteOption:W,handlePatternKeyDown:g,handlePatternInputInput:j,handlePatternInputBlur:fe,handlePatternInputFocus:Re,handleMouseEnterCounter:Me,handleMouseLeaveCounter:_e,handleFocusout:$,handleCompositionEnd:Se,handleCompositionStart:ie,onPopoverUpdateShow:Ae,focus:Te,focusInput:ge,blur:le,blurInput:ke,updateCounter:Pe,getCounter:Ie,getTail:ze,renderLabel:e.renderLabel,cssVars:Fe?void 0:we,themeClass:oe?.themeClass,onRender:oe?.onRender}},render(){const{status:e,multiple:t,size:n,disabled:o,filterable:i,maxTagCount:s,bordered:r,clsPrefix:a,ellipsisTagPopoverProps:h,onRender:u,renderTag:d,renderLabel:b}=this;u?.();const S=s==="responsive",T=typeof s=="number",x=S||T,z=c(zn,null,{default:()=>c(Wn,{clsPrefix:a,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var O,k;return(k=(O=this.$slots).arrow)===null||k===void 0?void 0:k.call(O)}})});let V;if(t){const{labelField:O}=this,k=v=>c("div",{class:`${a}-base-selection-tag-wrapper`,key:v.value},d?d({option:v,handleClose:()=>{this.handleDeleteOption(v)}}):c(nt,{size:n,closable:!v.disabled,disabled:o,onClose:()=>{this.handleDeleteOption(v)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>b?b(v,!0):Oe(v[O],v,!0)})),F=()=>(T?this.selectedOptions.slice(0,s):this.selectedOptions).map(k),p=i?c("div",{class:`${a}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},c("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:o,value:this.pattern,autofocus:this.autofocus,class:`${a}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),c("span",{ref:"patternInputMirrorRef",class:`${a}-base-selection-input-tag__mirror`},this.pattern)):null,y=S?()=>c("div",{class:`${a}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},c(nt,{size:n,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:o})):void 0;let N;if(T){const v=this.selectedOptions.length-s;v>0&&(N=c("div",{class:`${a}-base-selection-tag-wrapper`,key:"__counter__"},c(nt,{size:n,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:o},{default:()=>`+${v}`})))}const E=S?i?c(Tt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:F,counter:y,tail:()=>p}):c(Tt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:F,counter:y}):T&&N?F().concat(N):F(),X=x?()=>c("div",{class:`${a}-base-selection-popover`},S?F():this.selectedOptions.map(k)):void 0,Y=x?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},h):null,ne=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?c("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`},c("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)):null,ae=i?c("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-tags`},E,S?null:p,z):c("div",{ref:"multipleElRef",class:`${a}-base-selection-tags`,tabindex:o?void 0:0},E,z);V=c(Cn,null,x?c($n,Object.assign({},Y,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>ae,default:X}):ae,ne)}else if(i){const O=this.pattern||this.isComposing,k=this.active?!O:!this.selected,F=this.active?!1:this.selected;V=c("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-label`,title:this.patternInputFocused?void 0:Ft(this.label)},c("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${a}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:o,disabled:o,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),F?c("div",{class:`${a}-base-selection-label__render-label ${a}-base-selection-overlay`,key:"input"},c("div",{class:`${a}-base-selection-overlay__wrapper`},d?d({option:this.selectedOption,handleClose:()=>{}}):b?b(this.selectedOption,!0):Oe(this.label,this.selectedOption,!0))):null,k?c("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},c("div",{class:`${a}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,z)}else V=c("div",{ref:"singleElRef",class:`${a}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?c("div",{class:`${a}-base-selection-input`,title:Ft(this.label),key:"input"},c("div",{class:`${a}-base-selection-input__content`},d?d({option:this.selectedOption,handleClose:()=>{}}):b?b(this.selectedOption,!0):Oe(this.label,this.selectedOption,!0))):c("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},c("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)),z);return c("div",{ref:"selfRef",class:[`${a}-base-selection`,this.rtlEnabled&&`${a}-base-selection--rtl`,this.themeClass,e&&`${a}-base-selection--${e}-status`,{[`${a}-base-selection--active`]:this.active,[`${a}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${a}-base-selection--disabled`]:this.disabled,[`${a}-base-selection--multiple`]:this.multiple,[`${a}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},V,r?c("div",{class:`${a}-base-selection__border`}):null,r?c("div",{class:`${a}-base-selection__state-border`}):null)}});function qe(e){return e.type==="group"}function jt(e){return e.type==="ignored"}function st(e,t){try{return!!(1+t.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function Ao(e,t){return{getIsGroup:qe,getIgnored:jt,getKey(o){return qe(o)?o.name||o.key||"key-required":o[e]},getChildren(o){return o[t]}}}function Bo(e,t,n,o){if(!t)return e;function i(s){if(!Array.isArray(s))return[];const r=[];for(const a of s)if(qe(a)){const h=i(a[o]);h.length&&r.push(Object.assign({},a,{[o]:h}))}else{if(jt(a))continue;t(n,a)&&r.push(a)}return r}return i(e)}function Eo(e,t,n){const o=new Map;return e.forEach(i=>{qe(i)?i[n].forEach(s=>{o.set(s[t],s)}):o.set(i[t],i)}),o}const No=de([K("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 font-weight: var(--n-font-weight);
 `),K("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[Bt({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),Lo=Object.assign(Object.assign({},pe.props),{to:ft.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,menuSize:{type:String},filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),qo=se({name:"Select",props:Lo,slots:Object,setup(e){const{mergedClsPrefixRef:t,mergedBorderedRef:n,namespaceRef:o,inlineThemeDisabled:i}=Xe(e),s=pe("Select","-select",No,Bn,e,t),r=I(e.defaultValue),a=te(e,"value"),h=xt(a,r),u=I(!1),d=I(""),b=Hn(e,["items","options"]),S=I([]),T=I([]),x=_(()=>T.value.concat(S.value).concat(b.value)),z=_(()=>{const{filter:l}=e;if(l)return l;const{labelField:m,valueField:P}=e;return(D,A)=>{if(!A)return!1;const M=A[m];if(typeof M=="string")return st(D,M);const B=A[P];return typeof B=="string"?st(D,B):typeof B=="number"?st(D,String(B)):!1}}),V=_(()=>{if(e.remote)return b.value;{const{value:l}=x,{value:m}=d;return!m.length||!e.filterable?l:Bo(l,z.value,m,e.childrenField)}}),O=_(()=>{const{valueField:l,childrenField:m}=e,P=Ao(l,m);return To(V.value,P)}),k=_(()=>Eo(x.value,e.valueField,e.childrenField)),F=I(!1),p=xt(te(e,"show"),F),y=I(null),N=I(null),E=I(null),{localeRef:X}=Lt("Select"),Y=_(()=>{var l;return(l=e.placeholder)!==null&&l!==void 0?l:X.value.placeholder}),L=[],ne=I(new Map),ae=_(()=>{const{fallbackOption:l}=e;if(l===void 0){const{labelField:m,valueField:P}=e;return D=>({[m]:String(D),[P]:D})}return l===!1?!1:m=>Object.assign(l(m),{value:m})});function v(l){const m=e.remote,{value:P}=ne,{value:D}=k,{value:A}=ae,M=[];return l.forEach(B=>{if(D.has(B))M.push(D.get(B));else if(m&&P.has(B))M.push(P.get(B));else if(A){const ee=A(B);ee&&M.push(ee)}}),M}const R=_(()=>{if(e.multiple){const{value:l}=h;return Array.isArray(l)?v(l):[]}return null}),$=_(()=>{const{value:l}=h;return!e.multiple&&!Array.isArray(l)?l===null?null:v([l])[0]||null:null}),G=_n(e),{mergedSizeRef:Z,mergedDisabledRef:U,mergedStatusRef:q}=G;function W(l,m){const{onChange:P,"onUpdate:value":D,onUpdateValue:A}=e,{nTriggerFormChange:M,nTriggerFormInput:B}=G;P&&ce(P,l,m),A&&ce(A,l,m),D&&ce(D,l,m),r.value=l,M(),B()}function Q(l){const{onBlur:m}=e,{nTriggerFormBlur:P}=G;m&&ce(m,l),P()}function g(){const{onClear:l}=e;l&&ce(l)}function w(l){const{onFocus:m,showOnFocus:P}=e,{nTriggerFormFocus:D}=G;m&&ce(m,l),D(),P&&fe()}function j(l){const{onSearch:m}=e;m&&ce(m,l)}function ie(l){const{onScroll:m}=e;m&&ce(m,l)}function Se(){var l;const{remote:m,multiple:P}=e;if(m){const{value:D}=ne;if(P){const{valueField:A}=e;(l=R.value)===null||l===void 0||l.forEach(M=>{D.set(M[A],M)})}else{const A=$.value;A&&D.set(A[e.valueField],A)}}}function Re(l){const{onUpdateShow:m,"onUpdate:show":P}=e;m&&ce(m,l),P&&ce(P,l),F.value=l}function fe(){U.value||(Re(!0),F.value=!0,e.filterable&&Ke())}function le(){Re(!1)}function Te(){d.value="",T.value=L}const ge=I(!1);function ke(){e.filterable&&(ge.value=!0)}function Pe(){e.filterable&&(ge.value=!1,p.value||Te())}function Ie(){U.value||(p.value?e.filterable?Ke():le():fe())}function ze(l){var m,P;!((P=(m=E.value)===null||m===void 0?void 0:m.selfRef)===null||P===void 0)&&P.contains(l.relatedTarget)||(u.value=!1,Q(l),le())}function me(l){w(l),u.value=!0}function ye(){u.value=!0}function Me(l){var m;!((m=y.value)===null||m===void 0)&&m.$el.contains(l.relatedTarget)||(u.value=!1,Q(l),le())}function _e(){var l;(l=y.value)===null||l===void 0||l.focus(),le()}function Ae(l){var m;p.value&&(!((m=y.value)===null||m===void 0)&&m.$el.contains(En(l))||le())}function Fe(l){if(!Array.isArray(l))return[];if(ae.value)return Array.from(l);{const{remote:m}=e,{value:P}=k;if(m){const{value:D}=ne;return l.filter(A=>P.has(A)||D.has(A))}else return l.filter(D=>P.has(D))}}function we(l){oe(l.rawNode)}function oe(l){if(U.value)return;const{tag:m,remote:P,clearFilterAfterSelect:D,valueField:A}=e;if(m&&!P){const{value:M}=T,B=M[0]||null;if(B){const ee=S.value;ee.length?ee.push(B):S.value=[B],T.value=L}}if(P&&ne.value.set(l[A],l),e.multiple){const M=Fe(h.value),B=M.findIndex(ee=>ee===l[A]);if(~B){if(M.splice(B,1),m&&!P){const ee=f(l[A]);~ee&&(S.value.splice(ee,1),D&&(d.value=""))}}else M.push(l[A]),D&&(d.value="");W(M,v(M))}else{if(m&&!P){const M=f(l[A]);~M?S.value=[S.value[M]]:S.value=L}De(),le(),W(l[A],l)}}function f(l){return S.value.findIndex(P=>P[e.valueField]===l)}function C(l){p.value||fe();const{value:m}=l.target;d.value=m;const{tag:P,remote:D}=e;if(j(m),P&&!D){if(!m){T.value=L;return}const{onCreate:A}=e,M=A?A(m):{[e.labelField]:m,[e.valueField]:m},{valueField:B,labelField:ee}=e;b.value.some(ue=>ue[B]===M[B]||ue[ee]===M[ee])||S.value.some(ue=>ue[B]===M[B]||ue[ee]===M[ee])?T.value=L:T.value=[M]}}function J(l){l.stopPropagation();const{multiple:m}=e;!m&&e.filterable&&le(),g(),m?W([],[]):W(null,null)}function Ze(l){!Ne(l,"action")&&!Ne(l,"empty")&&!Ne(l,"header")&&l.preventDefault()}function Je(l){ie(l)}function $e(l){var m,P,D,A,M;if(!e.keyboard){l.preventDefault();return}switch(l.key){case" ":if(e.filterable)break;l.preventDefault();case"Enter":if(!(!((m=y.value)===null||m===void 0)&&m.isComposing)){if(p.value){const B=(P=E.value)===null||P===void 0?void 0:P.getPendingTmNode();B?we(B):e.filterable||(le(),De())}else if(fe(),e.tag&&ge.value){const B=T.value[0];if(B){const ee=B[e.valueField],{value:ue}=h;e.multiple&&Array.isArray(ue)&&ue.includes(ee)||oe(B)}}}l.preventDefault();break;case"ArrowUp":if(l.preventDefault(),e.loading)return;p.value&&((D=E.value)===null||D===void 0||D.prev());break;case"ArrowDown":if(l.preventDefault(),e.loading)return;p.value?(A=E.value)===null||A===void 0||A.next():fe();break;case"Escape":p.value&&(Nn(l),le()),(M=y.value)===null||M===void 0||M.focus();break}}function De(){var l;(l=y.value)===null||l===void 0||l.focus()}function Ke(){var l;(l=y.value)===null||l===void 0||l.focusInput()}function Qe(){var l;p.value&&((l=N.value)===null||l===void 0||l.syncPosition())}Se(),xe(te(e,"options"),Se);const et={focus:()=>{var l;(l=y.value)===null||l===void 0||l.focus()},focusInput:()=>{var l;(l=y.value)===null||l===void 0||l.focusInput()},blur:()=>{var l;(l=y.value)===null||l===void 0||l.blur()},blurInput:()=>{var l;(l=y.value)===null||l===void 0||l.blurInput()}},Ve=_(()=>{const{self:{menuBoxShadow:l}}=s.value;return{"--n-menu-box-shadow":l}}),be=i?Ye("select",void 0,Ve,e):void 0;return Object.assign(Object.assign({},et),{mergedStatus:q,mergedClsPrefix:t,mergedBordered:n,namespace:o,treeMate:O,isMounted:An(),triggerRef:y,menuRef:E,pattern:d,uncontrolledShow:F,mergedShow:p,adjustedTo:ft(e),uncontrolledValue:r,mergedValue:h,followerRef:N,localizedPlaceholder:Y,selectedOption:$,selectedOptions:R,mergedSize:Z,mergedDisabled:U,focused:u,activeWithoutMenuOpen:ge,inlineThemeDisabled:i,onTriggerInputFocus:ke,onTriggerInputBlur:Pe,handleTriggerOrMenuResize:Qe,handleMenuFocus:ye,handleMenuBlur:Me,handleMenuTabOut:_e,handleTriggerClick:Ie,handleToggle:we,handleDeleteOption:oe,handlePatternInput:C,handleClear:J,handleTriggerBlur:ze,handleTriggerFocus:me,handleKeydown:$e,handleMenuAfterLeave:Te,handleMenuClickOutside:Ae,handleMenuScroll:Je,handleMenuKeydown:$e,handleMenuMousedown:Ze,mergedTheme:s,cssVars:i?void 0:Ve,themeClass:be?.themeClass,onRender:be?.onRender})},render(){return c("div",{class:`${this.mergedClsPrefix}-select`},c(Dn,null,{default:()=>[c(Kn,null,{default:()=>c(_o,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,t;return[(t=(e=this.$slots).arrow)===null||t===void 0?void 0:t.call(e)]}})}),c(Vn,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===ft.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>c(Mt,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,t,n;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),Rn(c(zo,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(t=this.menuProps)===null||t===void 0?void 0:t.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:this.menuSize,renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(n=this.menuProps)===null||n===void 0?void 0:n.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var o,i;return[(i=(o=this.$slots).empty)===null||i===void 0?void 0:i.call(o)]},header:()=>{var o,i;return[(i=(o=this.$slots).header)===null||i===void 0?void 0:i.call(o)]},action:()=>{var o,i;return[(i=(o=this.$slots).action)===null||i===void 0?void 0:i.call(o)]}}),this.displayDirective==="show"?[[Tn,this.mergedShow],[wt,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[wt,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}});export{Zn as F,qo as N,Tt as V,ko as a,zo as b,To as c,Ao as d,Xn as e,it as m};
