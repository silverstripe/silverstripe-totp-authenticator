!function(){var e={274:function(e,t,r){"use strict";var n,o=(n=r(521))&&n.__esModule?n:{default:n};window.document.addEventListener("DOMContentLoaded",(()=>{(0,o.default)()}))},521:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(r(648)),o=a(r(919)),i=a(r(599));function a(e){return e&&e.__esModule?e:{default:e}}t.default=()=>{n.default.component.registerMany({TOTPRegister:i.default,TOTPVerify:o.default})}},599:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.Component=void 0;var n,o=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=u(t);if(r&&r.has(e))return r.get(e);var n={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var a=o?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}n.default=e,r&&r.set(e,n);return n}(r(294)),i=(n=r(697))&&n.__esModule?n:{default:n},a=r(59),s=r(661),l=r(648);function u(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(u=function(e){return e?r:t})(e)}const c="SCAN_CODE",f="VALIDATE_CODE";class d extends o.Component{constructor(e){super(e),this.state={error:e.error,view:e.error?f:c},this.handleBack=this.handleBack.bind(this),this.handleBackToScan=this.handleBackToScan.bind(this),this.handleNext=this.handleNext.bind(this)}handleBack(){this.props.onBack()}handleBackToScan(){this.setState({view:c,error:null})}handleNext(){this.setState({view:f})}renderActionsMenu(){const{ss:{i18n:e}}=window;return o.default.createElement("ul",{className:"mfa-action-list"},o.default.createElement("li",{className:"mfa-action-list__item"},o.default.createElement("button",{type:"button",className:"btn btn-primary",onClick:this.handleNext},e._t("TOTPRegister.NEXT","Next"))),o.default.createElement("li",{className:"mfa-action-list__item"},o.default.createElement("button",{type:"button",className:"btn btn-secondary",onClick:this.handleBack},e._t("TOTPRegister.BACK","Back"))))}renderErrorScreen(){const{errors:e}=this.props;return e.length?o.default.createElement("div",{className:"mfa-totp__errors"},e.join(", ")):null}renderScanCodeScreen(){const{uri:e,code:t,errors:r}=this.props,{view:n}=this.state,{ss:{i18n:i}}=window;if(n!==c||r.length)return null;const l=(0,s.formatCode)(t);return o.default.createElement("div",null,o.default.createElement("div",{className:"mfa-totp__scan"},o.default.createElement("p",null,i._t("TOTPRegister.INTRO","Verification codes are created by an app on your phone. "),this.renderSupportLink()),o.default.createElement("div",{className:"mfa-totp__scan-code"},o.default.createElement("div",{className:"mfa-totp__scan-left"},o.default.createElement(a.QRCodeSVG,{value:e,size:160})),o.default.createElement("div",{className:"mfa-totp__scan-middle"},i._t("TOTPRegister.OR","Or")),o.default.createElement("div",{className:"mfa-totp__scan-right"},o.default.createElement("p",null,i._t("TOTPRegister.MANUAL","Enter manually the following code into authentication app:")),o.default.createElement("p",{className:"mfa-totp__manual-code"},l)))),this.renderActionsMenu())}renderSupportLink(){const{method:{supportLink:e,supportText:t}}=this.props,{ss:{i18n:r}}=window;return e?o.default.createElement("a",{href:e,target:"_blank",rel:"noopener noreferrer"},t||r._t("TOTPRegister.HOW_TO_USE","How to use authenticator apps.")):null}renderBackButtonForVerify(){const{ss:{i18n:e}}=window;return o.default.createElement("button",{type:"button",className:"mfa-actions__action mfa-actions__action--back btn btn-secondary",onClick:this.handleBackToScan},e._t("TOTPRegister.BACK","Back"))}renderValidateCodeScreen(){const{error:e,view:t}=this.state,{TOTPVerifyComponent:r,onCompleteRegistration:n,errors:i}=this.props;if(t!==f||i.length)return null;const a={...this.props,error:e,moreOptionsControl:this.renderBackButtonForVerify(),onCompleteVerification:n,onCompleteRegistration:null};return o.default.createElement(r,a)}render(){return o.default.createElement("div",{className:"mfa-totp__container mfa-totp__container--register"},this.renderErrorScreen(),this.renderScanCodeScreen(),this.renderValidateCodeScreen())}}t.Component=d,d.propTypes={code:i.default.string.isRequired,onBack:i.default.func.isRequired,onCompleteRegistration:i.default.func.isRequired,errors:i.default.arrayOf(i.default.string),method:i.default.object.isRequired,uri:i.default.string.isRequired,TOTPVerifyComponent:i.default.oneOfType([i.default.node,i.default.func]).isRequired},d.defaultProps={code:"",errors:[]},d.displayName="TOTPRegister";var h=(0,l.inject)(["TOTPVerify"],(e=>({TOTPVerifyComponent:e})),(()=>"MFA.Register"))(d);t.default=h},919:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=s(t);if(r&&r.has(e))return r.get(e);var n={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var a=o?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}n.default=e,r&&r.set(e,n);return n}(r(294)),o=a(r(697)),i=a(r(184));function a(e){return e&&e.__esModule?e:{default:e}}function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(s=function(e){return e?r:t})(e)}class l extends n.Component{constructor(e){super(e),this.state={code:""},this.codeInput=null,this.setCodeInput=e=>{this.codeInput=e},this.handleChangeCode=this.handleChangeCode.bind(this),this.handleInputKeyUp=this.handleInputKeyUp.bind(this),this.handleSubmit=this.handleSubmit.bind(this)}componentDidMount(){this.codeInput&&this.codeInput.focus()}handleChangeCode(e){this.setState({code:e.target.value})}handleInputKeyUp(e){this.canSubmit()&&13===e.keyCode&&this.handleSubmit()}handleSubmit(){this.props.onCompleteVerification({code:this.state.code})}canSubmit(){return this.state.code.length===this.props.codeLength}renderActionsMenu(){const{moreOptionsControl:e}=this.props,{ss:{i18n:t}}=window,r=!this.canSubmit();return n.default.createElement("ul",{className:"mfa-action-list"},n.default.createElement("li",{className:"mfa-action-list__item"},n.default.createElement("button",{type:"button",className:"btn btn-primary",disabled:r,onClick:this.handleSubmit},t._t("TOTPVerify.NEXT","Next"))),e&&n.default.createElement("li",{className:"mfa-action-list__item"},e))}renderSupportLink(){const{method:{supportLink:e,supportText:t}}=this.props,{ss:{i18n:r}}=window;return e?n.default.createElement("a",{href:e,target:"_blank",rel:"noopener noreferrer"},t||r._t("TOTPVerify.HOW_TO_USE","How to use authenticator apps.")):null}renderVerifyForm(){const{code:e}=this.state,{codeLength:t,error:r,method:o}=this.props,{ss:{i18n:a}}=window,s=(0,i.default)("mfa-totp__validate-left",{"has-error":!!r});return n.default.createElement("div",{className:"mfa-totp__validate-code"},n.default.createElement("div",{className:s},n.default.createElement("p",null,a._t("TOTPVerify.VERIFY","Use verification code from your authenticator app. "),this.renderSupportLink()),n.default.createElement("label",{htmlFor:"totp-code",className:"control-label"},a.inject(a._t("TOTPVerify.ENTER_CODE","Enter {length}-digit code"),{length:t})),n.default.createElement("input",{id:"totp-code",name:"code",type:"text",autoComplete:"off",maxLength:t,className:"mfa-totp__code text form-control input-lg",value:e,ref:this.setCodeInput,onChange:this.handleChangeCode,onKeyUp:this.handleInputKeyUp}),r&&n.default.createElement("div",{className:"help-block"},r)),o.thumbnail&&n.default.createElement("div",{className:"mfa-totp__validate-right"},n.default.createElement("img",{src:o.thumbnail,alt:o.name,className:"mfa-totp__validate-img"})))}render(){return n.default.createElement("div",{className:"mfa-totp__container mfa-totp__container--verify"},this.renderVerifyForm(),this.renderActionsMenu())}}l.propTypes={codeLength:o.default.number,error:o.default.string,onCompleteVerification:o.default.func.isRequired,method:o.default.object.isRequired},l.defaultProps={codeLength:6,error:null},l.displayName="TOTPVerify";var u=l;t.default=u},661:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.formatCode=void 0;t.formatCode=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:" ";if(e.length<6)return e;if(e.length%4==0)return e.split(/(.{4})/g).filter((e=>e)).join(t).trim();if(e.length%3==0)return e.split(/(.{3})/g).filter((e=>e)).join(t).trim();const r=4-e.length%4,n=(e.length-3*r)/4,o=[...[...Array(n).keys()].map((()=>4)),...[...Array(r).keys()].map((()=>3))];let i=0;return o.map((t=>e.substring(i,i+=t))).join(t).trim()}},184:function(e,t){var r;!function(){"use strict";var n={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var r=arguments[t];if(r){var i=typeof r;if("string"===i||"number"===i)e.push(r);else if(Array.isArray(r)){if(r.length){var a=o.apply(null,r);a&&e.push(a)}}else if("object"===i){if(r.toString!==Object.prototype.toString&&!r.toString.toString().includes("[native code]")){e.push(r.toString());continue}for(var s in r)n.call(r,s)&&r[s]&&e.push(s)}}}return e.join(" ")}e.exports?(o.default=o,e.exports=o):void 0===(r=function(){return o}.apply(t,[]))||(e.exports=r)}()},703:function(e,t,r){"use strict";var n=r(414);function o(){}function i(){}i.resetWarningCache=o,e.exports=function(){function e(e,t,r,o,i,a){if(a!==n){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function t(){return e}e.isRequired=e;var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:o};return r.PropTypes=r,r}},697:function(e,t,r){e.exports=r(703)()},414:function(e){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},59:function(e,t,r){"use strict";r.r(t),r.d(t,{QRCodeCanvas:function(){return M},QRCodeSVG:function(){return S},default:function(){return O}});var n,o=r(294),i=Object.defineProperty,a=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,u=(e,t,r)=>t in e?i(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,c=(e,t)=>{for(var r in t||(t={}))s.call(t,r)&&u(e,r,t[r]);if(a)for(var r of a(t))l.call(t,r)&&u(e,r,t[r]);return e},f=(e,t)=>{var r={};for(var n in e)s.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&a)for(var n of a(e))t.indexOf(n)<0&&l.call(e,n)&&(r[n]=e[n]);return r};(e=>{const t=class{constructor(e,r,n,o){if(this.version=e,this.errorCorrectionLevel=r,this.modules=[],this.isFunction=[],e<t.MIN_VERSION||e>t.MAX_VERSION)throw new RangeError("Version value out of range");if(o<-1||o>7)throw new RangeError("Mask value out of range");this.size=4*e+17;let a=[];for(let e=0;e<this.size;e++)a.push(!1);for(let e=0;e<this.size;e++)this.modules.push(a.slice()),this.isFunction.push(a.slice());this.drawFunctionPatterns();const s=this.addEccAndInterleave(n);if(this.drawCodewords(s),-1==o){let e=1e9;for(let t=0;t<8;t++){this.applyMask(t),this.drawFormatBits(t);const r=this.getPenaltyScore();r<e&&(o=t,e=r),this.applyMask(t)}}i(0<=o&&o<=7),this.mask=o,this.applyMask(o),this.drawFormatBits(o),this.isFunction=[]}static encodeText(r,n){const o=e.QrSegment.makeSegments(r);return t.encodeSegments(o,n)}static encodeBinary(r,n){const o=e.QrSegment.makeBytes(r);return t.encodeSegments([o],n)}static encodeSegments(e,r,o=1,a=40,l=-1,u=!0){if(!(t.MIN_VERSION<=o&&o<=a&&a<=t.MAX_VERSION)||l<-1||l>7)throw new RangeError("Invalid value");let c,f;for(c=o;;c++){const n=8*t.getNumDataCodewords(c,r),o=s.getTotalBits(e,c);if(o<=n){f=o;break}if(c>=a)throw new RangeError("Data too long")}for(const e of[t.Ecc.MEDIUM,t.Ecc.QUARTILE,t.Ecc.HIGH])u&&f<=8*t.getNumDataCodewords(c,e)&&(r=e);let d=[];for(const t of e){n(t.mode.modeBits,4,d),n(t.numChars,t.mode.numCharCountBits(c),d);for(const e of t.getData())d.push(e)}i(d.length==f);const h=8*t.getNumDataCodewords(c,r);i(d.length<=h),n(0,Math.min(4,h-d.length),d),n(0,(8-d.length%8)%8,d),i(d.length%8==0);for(let e=236;d.length<h;e^=253)n(e,8,d);let p=[];for(;8*p.length<d.length;)p.push(0);return d.forEach(((e,t)=>p[t>>>3]|=e<<7-(7&t))),new t(c,r,p,l)}getModule(e,t){return 0<=e&&e<this.size&&0<=t&&t<this.size&&this.modules[t][e]}getModules(){return this.modules}drawFunctionPatterns(){for(let e=0;e<this.size;e++)this.setFunctionModule(6,e,e%2==0),this.setFunctionModule(e,6,e%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);const e=this.getAlignmentPatternPositions(),t=e.length;for(let r=0;r<t;r++)for(let n=0;n<t;n++)0==r&&0==n||0==r&&n==t-1||r==t-1&&0==n||this.drawAlignmentPattern(e[r],e[n]);this.drawFormatBits(0),this.drawVersion()}drawFormatBits(e){const t=this.errorCorrectionLevel.formatBits<<3|e;let r=t;for(let e=0;e<10;e++)r=r<<1^1335*(r>>>9);const n=21522^(t<<10|r);i(n>>>15==0);for(let e=0;e<=5;e++)this.setFunctionModule(8,e,o(n,e));this.setFunctionModule(8,7,o(n,6)),this.setFunctionModule(8,8,o(n,7)),this.setFunctionModule(7,8,o(n,8));for(let e=9;e<15;e++)this.setFunctionModule(14-e,8,o(n,e));for(let e=0;e<8;e++)this.setFunctionModule(this.size-1-e,8,o(n,e));for(let e=8;e<15;e++)this.setFunctionModule(8,this.size-15+e,o(n,e));this.setFunctionModule(8,this.size-8,!0)}drawVersion(){if(this.version<7)return;let e=this.version;for(let t=0;t<12;t++)e=e<<1^7973*(e>>>11);const t=this.version<<12|e;i(t>>>18==0);for(let e=0;e<18;e++){const r=o(t,e),n=this.size-11+e%3,i=Math.floor(e/3);this.setFunctionModule(n,i,r),this.setFunctionModule(i,n,r)}}drawFinderPattern(e,t){for(let r=-4;r<=4;r++)for(let n=-4;n<=4;n++){const o=Math.max(Math.abs(n),Math.abs(r)),i=e+n,a=t+r;0<=i&&i<this.size&&0<=a&&a<this.size&&this.setFunctionModule(i,a,2!=o&&4!=o)}}drawAlignmentPattern(e,t){for(let r=-2;r<=2;r++)for(let n=-2;n<=2;n++)this.setFunctionModule(e+n,t+r,1!=Math.max(Math.abs(n),Math.abs(r)))}setFunctionModule(e,t,r){this.modules[t][e]=r,this.isFunction[t][e]=!0}addEccAndInterleave(e){const r=this.version,n=this.errorCorrectionLevel;if(e.length!=t.getNumDataCodewords(r,n))throw new RangeError("Invalid argument");const o=t.NUM_ERROR_CORRECTION_BLOCKS[n.ordinal][r],a=t.ECC_CODEWORDS_PER_BLOCK[n.ordinal][r],s=Math.floor(t.getNumRawDataModules(r)/8),l=o-s%o,u=Math.floor(s/o);let c=[];const f=t.reedSolomonComputeDivisor(a);for(let r=0,n=0;r<o;r++){let o=e.slice(n,n+u-a+(r<l?0:1));n+=o.length;const i=t.reedSolomonComputeRemainder(o,f);r<l&&o.push(0),c.push(o.concat(i))}let d=[];for(let e=0;e<c[0].length;e++)c.forEach(((t,r)=>{(e!=u-a||r>=l)&&d.push(t[e])}));return i(d.length==s),d}drawCodewords(e){if(e.length!=Math.floor(t.getNumRawDataModules(this.version)/8))throw new RangeError("Invalid argument");let r=0;for(let t=this.size-1;t>=1;t-=2){6==t&&(t=5);for(let n=0;n<this.size;n++)for(let i=0;i<2;i++){const a=t-i,s=0==(t+1&2)?this.size-1-n:n;!this.isFunction[s][a]&&r<8*e.length&&(this.modules[s][a]=o(e[r>>>3],7-(7&r)),r++)}}i(r==8*e.length)}applyMask(e){if(e<0||e>7)throw new RangeError("Mask value out of range");for(let t=0;t<this.size;t++)for(let r=0;r<this.size;r++){let n;switch(e){case 0:n=(r+t)%2==0;break;case 1:n=t%2==0;break;case 2:n=r%3==0;break;case 3:n=(r+t)%3==0;break;case 4:n=(Math.floor(r/3)+Math.floor(t/2))%2==0;break;case 5:n=r*t%2+r*t%3==0;break;case 6:n=(r*t%2+r*t%3)%2==0;break;case 7:n=((r+t)%2+r*t%3)%2==0;break;default:throw new Error("Unreachable")}!this.isFunction[t][r]&&n&&(this.modules[t][r]=!this.modules[t][r])}}getPenaltyScore(){let e=0;for(let r=0;r<this.size;r++){let n=!1,o=0,i=[0,0,0,0,0,0,0];for(let a=0;a<this.size;a++)this.modules[r][a]==n?(o++,5==o?e+=t.PENALTY_N1:o>5&&e++):(this.finderPenaltyAddHistory(o,i),n||(e+=this.finderPenaltyCountPatterns(i)*t.PENALTY_N3),n=this.modules[r][a],o=1);e+=this.finderPenaltyTerminateAndCount(n,o,i)*t.PENALTY_N3}for(let r=0;r<this.size;r++){let n=!1,o=0,i=[0,0,0,0,0,0,0];for(let a=0;a<this.size;a++)this.modules[a][r]==n?(o++,5==o?e+=t.PENALTY_N1:o>5&&e++):(this.finderPenaltyAddHistory(o,i),n||(e+=this.finderPenaltyCountPatterns(i)*t.PENALTY_N3),n=this.modules[a][r],o=1);e+=this.finderPenaltyTerminateAndCount(n,o,i)*t.PENALTY_N3}for(let r=0;r<this.size-1;r++)for(let n=0;n<this.size-1;n++){const o=this.modules[r][n];o==this.modules[r][n+1]&&o==this.modules[r+1][n]&&o==this.modules[r+1][n+1]&&(e+=t.PENALTY_N2)}let r=0;for(const e of this.modules)r=e.reduce(((e,t)=>e+(t?1:0)),r);const n=this.size*this.size,o=Math.ceil(Math.abs(20*r-10*n)/n)-1;return i(0<=o&&o<=9),e+=o*t.PENALTY_N4,i(0<=e&&e<=2568888),e}getAlignmentPatternPositions(){if(1==this.version)return[];{const e=Math.floor(this.version/7)+2,t=32==this.version?26:2*Math.ceil((4*this.version+4)/(2*e-2));let r=[6];for(let n=this.size-7;r.length<e;n-=t)r.splice(1,0,n);return r}}static getNumRawDataModules(e){if(e<t.MIN_VERSION||e>t.MAX_VERSION)throw new RangeError("Version number out of range");let r=(16*e+128)*e+64;if(e>=2){const t=Math.floor(e/7)+2;r-=(25*t-10)*t-55,e>=7&&(r-=36)}return i(208<=r&&r<=29648),r}static getNumDataCodewords(e,r){return Math.floor(t.getNumRawDataModules(e)/8)-t.ECC_CODEWORDS_PER_BLOCK[r.ordinal][e]*t.NUM_ERROR_CORRECTION_BLOCKS[r.ordinal][e]}static reedSolomonComputeDivisor(e){if(e<1||e>255)throw new RangeError("Degree out of range");let r=[];for(let t=0;t<e-1;t++)r.push(0);r.push(1);let n=1;for(let o=0;o<e;o++){for(let e=0;e<r.length;e++)r[e]=t.reedSolomonMultiply(r[e],n),e+1<r.length&&(r[e]^=r[e+1]);n=t.reedSolomonMultiply(n,2)}return r}static reedSolomonComputeRemainder(e,r){let n=r.map((e=>0));for(const o of e){const e=o^n.shift();n.push(0),r.forEach(((r,o)=>n[o]^=t.reedSolomonMultiply(r,e)))}return n}static reedSolomonMultiply(e,t){if(e>>>8!=0||t>>>8!=0)throw new RangeError("Byte out of range");let r=0;for(let n=7;n>=0;n--)r=r<<1^285*(r>>>7),r^=(t>>>n&1)*e;return i(r>>>8==0),r}finderPenaltyCountPatterns(e){const t=e[1];i(t<=3*this.size);const r=t>0&&e[2]==t&&e[3]==3*t&&e[4]==t&&e[5]==t;return(r&&e[0]>=4*t&&e[6]>=t?1:0)+(r&&e[6]>=4*t&&e[0]>=t?1:0)}finderPenaltyTerminateAndCount(e,t,r){return e&&(this.finderPenaltyAddHistory(t,r),t=0),t+=this.size,this.finderPenaltyAddHistory(t,r),this.finderPenaltyCountPatterns(r)}finderPenaltyAddHistory(e,t){0==t[0]&&(e+=this.size),t.pop(),t.unshift(e)}};let r=t;function n(e,t,r){if(t<0||t>31||e>>>t!=0)throw new RangeError("Value out of range");for(let n=t-1;n>=0;n--)r.push(e>>>n&1)}function o(e,t){return 0!=(e>>>t&1)}function i(e){if(!e)throw new Error("Assertion error")}r.MIN_VERSION=1,r.MAX_VERSION=40,r.PENALTY_N1=3,r.PENALTY_N2=3,r.PENALTY_N3=40,r.PENALTY_N4=10,r.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],r.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]],e.QrCode=r;const a=class{constructor(e,t,r){if(this.mode=e,this.numChars=t,this.bitData=r,t<0)throw new RangeError("Invalid argument");this.bitData=r.slice()}static makeBytes(e){let t=[];for(const r of e)n(r,8,t);return new a(a.Mode.BYTE,e.length,t)}static makeNumeric(e){if(!a.isNumeric(e))throw new RangeError("String contains non-numeric characters");let t=[];for(let r=0;r<e.length;){const o=Math.min(e.length-r,3);n(parseInt(e.substr(r,o),10),3*o+1,t),r+=o}return new a(a.Mode.NUMERIC,e.length,t)}static makeAlphanumeric(e){if(!a.isAlphanumeric(e))throw new RangeError("String contains unencodable characters in alphanumeric mode");let t,r=[];for(t=0;t+2<=e.length;t+=2){let o=45*a.ALPHANUMERIC_CHARSET.indexOf(e.charAt(t));o+=a.ALPHANUMERIC_CHARSET.indexOf(e.charAt(t+1)),n(o,11,r)}return t<e.length&&n(a.ALPHANUMERIC_CHARSET.indexOf(e.charAt(t)),6,r),new a(a.Mode.ALPHANUMERIC,e.length,r)}static makeSegments(e){return""==e?[]:a.isNumeric(e)?[a.makeNumeric(e)]:a.isAlphanumeric(e)?[a.makeAlphanumeric(e)]:[a.makeBytes(a.toUtf8ByteArray(e))]}static makeEci(e){let t=[];if(e<0)throw new RangeError("ECI assignment value out of range");if(e<128)n(e,8,t);else if(e<16384)n(2,2,t),n(e,14,t);else{if(!(e<1e6))throw new RangeError("ECI assignment value out of range");n(6,3,t),n(e,21,t)}return new a(a.Mode.ECI,0,t)}static isNumeric(e){return a.NUMERIC_REGEX.test(e)}static isAlphanumeric(e){return a.ALPHANUMERIC_REGEX.test(e)}getData(){return this.bitData.slice()}static getTotalBits(e,t){let r=0;for(const n of e){const e=n.mode.numCharCountBits(t);if(n.numChars>=1<<e)return 1/0;r+=4+e+n.bitData.length}return r}static toUtf8ByteArray(e){e=encodeURI(e);let t=[];for(let r=0;r<e.length;r++)"%"!=e.charAt(r)?t.push(e.charCodeAt(r)):(t.push(parseInt(e.substr(r+1,2),16)),r+=2);return t}};let s=a;s.NUMERIC_REGEX=/^[0-9]*$/,s.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,s.ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",e.QrSegment=s})(n||(n={})),(e=>{let t;(e=>{const t=class{constructor(e,t){this.ordinal=e,this.formatBits=t}};let r=t;r.LOW=new t(0,1),r.MEDIUM=new t(1,0),r.QUARTILE=new t(2,3),r.HIGH=new t(3,2),e.Ecc=r})(t=e.QrCode||(e.QrCode={}))})(n||(n={})),(e=>{let t;(e=>{const t=class{constructor(e,t){this.modeBits=e,this.numBitsCharCount=t}numCharCountBits(e){return this.numBitsCharCount[Math.floor((e+7)/17)]}};let r=t;r.NUMERIC=new t(1,[10,12,14]),r.ALPHANUMERIC=new t(2,[9,11,13]),r.BYTE=new t(4,[8,16,16]),r.KANJI=new t(8,[8,10,12]),r.ECI=new t(7,[0,0,0]),e.Mode=r})(t=e.QrSegment||(e.QrSegment={}))})(n||(n={}));var d=n,h={L:d.QrCode.Ecc.LOW,M:d.QrCode.Ecc.MEDIUM,Q:d.QrCode.Ecc.QUARTILE,H:d.QrCode.Ecc.HIGH},p=128,m="L",y="#FFFFFF",g="#000000",E=!1,_=4,v=.1;function C(e,t=0){const r=[];return e.forEach((function(e,n){let o=null;e.forEach((function(i,a){if(!i&&null!==o)return r.push(`M${o+t} ${n+t}h${a-o}v1H${o+t}z`),void(o=null);if(a!==e.length-1)i&&null===o&&(o=a);else{if(!i)return;null===o?r.push(`M${a+t},${n+t} h1v1H${a+t}z`):r.push(`M${o+t},${n+t} h${a+1-o}v1H${o+t}z`)}}))})),r.join("")}function w(e,t){return e.slice().map(((e,r)=>r<t.y||r>=t.y+t.h?e:e.map(((e,r)=>(r<t.x||r>=t.x+t.w)&&e))))}function b(e,t,r,n){if(null==n)return null;const o=r?_:0,i=e.length+2*o,a=Math.floor(t*v),s=i/t,l=(n.width||a)*s,u=(n.height||a)*s,c=null==n.x?e.length/2-l/2:n.x*s,f=null==n.y?e.length/2-u/2:n.y*s;let d=null;if(n.excavate){let e=Math.floor(c),t=Math.floor(f);d={x:e,y:t,w:Math.ceil(l+c-e),h:Math.ceil(u+f-t)}}return{x:c,y:f,h:u,w:l,excavation:d}}var R=function(){try{(new Path2D).addPath(new Path2D)}catch(e){return!1}return!0}();function M(e){const t=e,{value:r,size:n=p,level:i=m,bgColor:a=y,fgColor:s=g,includeMargin:l=E,style:u,imageSettings:v}=t,M=f(t,["value","size","level","bgColor","fgColor","includeMargin","style","imageSettings"]),S=null==v?void 0:v.src,O=(0,o.useRef)(null),P=(0,o.useRef)(null),[N,T]=(0,o.useState)(!1);(0,o.useEffect)((()=>{if(null!=O.current){const e=O.current,t=e.getContext("2d");if(!t)return;let o=d.QrCode.encodeText(r,h[i]).getModules();const u=l?_:0,c=o.length+2*u,f=b(o,n,l,v),p=P.current,m=null!=f&&null!==p&&p.complete&&0!==p.naturalHeight&&0!==p.naturalWidth;m&&null!=f.excavation&&(o=w(o,f.excavation));const y=window.devicePixelRatio||1;e.height=e.width=n*y;const g=n/c*y;t.scale(g,g),t.fillStyle=a,t.fillRect(0,0,c,c),t.fillStyle=s,R?t.fill(new Path2D(C(o,u))):o.forEach((function(e,r){e.forEach((function(e,n){e&&t.fillRect(n+u,r+u,1,1)}))})),m&&t.drawImage(p,f.x+u,f.y+u,f.w,f.h)}})),(0,o.useEffect)((()=>{T(!1)}),[S]);const A=c({height:n,width:n},u);let k=null;return null!=S&&(k=o.createElement("img",{src:S,key:S,style:{display:"none"},onLoad:()=>{T(!0)},ref:P})),o.createElement(o.Fragment,null,o.createElement("canvas",c({style:A,height:n,width:n,ref:O},M)),k)}function S(e){const t=e,{value:r,size:n=p,level:i=m,bgColor:a=y,fgColor:s=g,includeMargin:l=E,imageSettings:u}=t,v=f(t,["value","size","level","bgColor","fgColor","includeMargin","imageSettings"]);let R=d.QrCode.encodeText(r,h[i]).getModules();const M=l?_:0,S=R.length+2*M,O=b(R,n,l,u);let P=null;null!=u&&null!=O&&(null!=O.excavation&&(R=w(R,O.excavation)),P=o.createElement("image",{xlinkHref:u.src,height:O.h,width:O.w,x:O.x+M,y:O.y+M,preserveAspectRatio:"none"}));const N=C(R,M);return o.createElement("svg",c({height:n,width:n,viewBox:`0 0 ${S} ${S}`},v),o.createElement("path",{fill:a,d:`M0,0 h${S}v${S}H0z`,shapeRendering:"crispEdges"}),o.createElement("path",{fill:s,d:N,shapeRendering:"crispEdges"}),P)}var O=e=>{const t=e,{renderAs:r}=t,n=f(t,["renderAs"]);return"svg"===r?o.createElement(S,c({},n)):o.createElement(M,c({},n))}},408:function(e,t){"use strict";var r=Symbol.for("react.element"),n=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),s=Symbol.for("react.provider"),l=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),c=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),d=Symbol.for("react.lazy"),h=Symbol.iterator;var p={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},m=Object.assign,y={};function g(e,t,r){this.props=e,this.context=t,this.refs=y,this.updater=r||p}function E(){}function _(e,t,r){this.props=e,this.context=t,this.refs=y,this.updater=r||p}g.prototype.isReactComponent={},g.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},g.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},E.prototype=g.prototype;var v=_.prototype=new E;v.constructor=_,m(v,g.prototype),v.isPureReactComponent=!0;var C=Array.isArray,w=Object.prototype.hasOwnProperty,b={current:null},R={key:!0,ref:!0,__self:!0,__source:!0};function M(e,t,n){var o,i={},a=null,s=null;if(null!=t)for(o in void 0!==t.ref&&(s=t.ref),void 0!==t.key&&(a=""+t.key),t)w.call(t,o)&&!R.hasOwnProperty(o)&&(i[o]=t[o]);var l=arguments.length-2;if(1===l)i.children=n;else if(1<l){for(var u=Array(l),c=0;c<l;c++)u[c]=arguments[c+2];i.children=u}if(e&&e.defaultProps)for(o in l=e.defaultProps)void 0===i[o]&&(i[o]=l[o]);return{$$typeof:r,type:e,key:a,ref:s,props:i,_owner:b.current}}function S(e){return"object"==typeof e&&null!==e&&e.$$typeof===r}var O=/\/+/g;function P(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return t[e]}))}(""+e.key):t.toString(36)}function N(e,t,o,i,a){var s=typeof e;"undefined"!==s&&"boolean"!==s||(e=null);var l=!1;if(null===e)l=!0;else switch(s){case"string":case"number":l=!0;break;case"object":switch(e.$$typeof){case r:case n:l=!0}}if(l)return a=a(l=e),e=""===i?"."+P(l,0):i,C(a)?(o="",null!=e&&(o=e.replace(O,"$&/")+"/"),N(a,t,o,"",(function(e){return e}))):null!=a&&(S(a)&&(a=function(e,t){return{$$typeof:r,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(a,o+(!a.key||l&&l.key===a.key?"":(""+a.key).replace(O,"$&/")+"/")+e)),t.push(a)),1;if(l=0,i=""===i?".":i+":",C(e))for(var u=0;u<e.length;u++){var c=i+P(s=e[u],u);l+=N(s,t,o,c,a)}else if(c=function(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=h&&e[h]||e["@@iterator"])?e:null}(e),"function"==typeof c)for(e=c.call(e),u=0;!(s=e.next()).done;)l+=N(s=s.value,t,o,c=i+P(s,u++),a);else if("object"===s)throw t=String(e),Error("Objects are not valid as a React child (found: "+("[object Object]"===t?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return l}function T(e,t,r){if(null==e)return e;var n=[],o=0;return N(e,n,"","",(function(e){return t.call(r,e,o++)})),n}function A(e){if(-1===e._status){var t=e._result;(t=t()).then((function(t){0!==e._status&&-1!==e._status||(e._status=1,e._result=t)}),(function(t){0!==e._status&&-1!==e._status||(e._status=2,e._result=t)})),-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var k={current:null},I={transition:null},x={ReactCurrentDispatcher:k,ReactCurrentBatchConfig:I,ReactCurrentOwner:b};t.Children={map:T,forEach:function(e,t,r){T(e,(function(){t.apply(this,arguments)}),r)},count:function(e){var t=0;return T(e,(function(){t++})),t},toArray:function(e){return T(e,(function(e){return e}))||[]},only:function(e){if(!S(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},t.Component=g,t.Fragment=o,t.Profiler=a,t.PureComponent=_,t.StrictMode=i,t.Suspense=c,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=x,t.cloneElement=function(e,t,n){if(null==e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=m({},e.props),i=e.key,a=e.ref,s=e._owner;if(null!=t){if(void 0!==t.ref&&(a=t.ref,s=b.current),void 0!==t.key&&(i=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(u in t)w.call(t,u)&&!R.hasOwnProperty(u)&&(o[u]=void 0===t[u]&&void 0!==l?l[u]:t[u])}var u=arguments.length-2;if(1===u)o.children=n;else if(1<u){l=Array(u);for(var c=0;c<u;c++)l[c]=arguments[c+2];o.children=l}return{$$typeof:r,type:e.type,key:i,ref:a,props:o,_owner:s}},t.createContext=function(e){return(e={$$typeof:l,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},t.createElement=M,t.createFactory=function(e){var t=M.bind(null,e);return t.type=e,t},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:u,render:e}},t.isValidElement=S,t.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:A}},t.memo=function(e,t){return{$$typeof:f,type:e,compare:void 0===t?null:t}},t.startTransition=function(e){var t=I.transition;I.transition={};try{e()}finally{I.transition=t}},t.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")},t.useCallback=function(e,t){return k.current.useCallback(e,t)},t.useContext=function(e){return k.current.useContext(e)},t.useDebugValue=function(){},t.useDeferredValue=function(e){return k.current.useDeferredValue(e)},t.useEffect=function(e,t){return k.current.useEffect(e,t)},t.useId=function(){return k.current.useId()},t.useImperativeHandle=function(e,t,r){return k.current.useImperativeHandle(e,t,r)},t.useInsertionEffect=function(e,t){return k.current.useInsertionEffect(e,t)},t.useLayoutEffect=function(e,t){return k.current.useLayoutEffect(e,t)},t.useMemo=function(e,t){return k.current.useMemo(e,t)},t.useReducer=function(e,t,r){return k.current.useReducer(e,t,r)},t.useRef=function(e){return k.current.useRef(e)},t.useState=function(e){return k.current.useState(e)},t.useSyncExternalStore=function(e,t,r){return k.current.useSyncExternalStore(e,t,r)},t.useTransition=function(){return k.current.useTransition()},t.version="18.2.0"},294:function(e,t,r){"use strict";e.exports=r(408)},648:function(e){"use strict";e.exports=Injector}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){"use strict";r(274)}()}();