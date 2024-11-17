var e=Object.defineProperty,t=(t,s,i)=>((t,s,i)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[s]=i)(t,"symbol"!=typeof s?s+"":s,i);import{p as s}from"./phaser-xYC74tLf.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const i={x:25,y:575,stepX:50},r="Rubik Mono One";class n extends s.Scene{constructor(){super("Game"),t(this,"chimneyGroup"),t(this,"presentGroup"),t(this,"arrow"),t(this,"texts"),t(this,"isRestarting",!1),t(this,"chimneyHits",[0,0,0,0,0,0,0,0]),t(this,"remainingPresents",8)}get score(){return this.chimneyHits.filter((e=>!!e)).length}get collidedPresents(){return this.chimneyHits.reduce(((e,t)=>e+t),0)}preload(){this.load.setPath("assets"),this.load.image("background","bg.jpg"),this.load.image("down-arrow","down-arrow.png"),this.load.image("present","present.png"),this.load.image("chimney","chimney.png"),this.load.image("square","square.png")}create(){this.add.image(200,300,"background"),this.setupArrow(),this.setupChimneys(),this.setupPresents(),this.createInfoElements()}setupArrow(){this.arrow=this.add.image(20,40,"down-arrow"),this.add.tween({targets:this.arrow,x:380,duration:1600,ease:"Linear",yoyo:!0,repeat:-1});const e=this.dropPresent.bind(this);this.input.on("pointerdown",e),this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on("down",e)}setupChimneys(){this.chimneyGroup=this.physics.add.staticGroup({key:"chimney",frame:0,repeat:7,setXY:i,setScale:{x:.1,y:.1}})}setupPresents(){this.presentGroup=this.physics.add.group({defaultKey:"present",maxSize:8,collideWorldBounds:!0});const e=this.physics.add.staticGroup({});e.createMultiple({key:"square",frame:0,repeat:6,setXY:{x:50,y:550,stepX:50}});for(const t of e.getChildren())t.setCircle(8);this.physics.add.collider(this.presentGroup,e),this.physics.add.collider(this.presentGroup,this.chimneyGroup,(e=>{this.handlePresentCollision(e)}))}handlePresentCollision(e){const{centerX:t}=e.getBounds(),s=Math.floor(t/i.stepX);e.destroy(),this.chimneyHits[s]+=1,this.setText("score",`${this.score}`);const r=this.add.image(i.x+s*i.stepX,i.y-i.stepX,"present").setAlpha(.1).setScale(.05).setOrigin(.5,.5);this.add.tween({targets:r,duration:250,y:i.y,alpha:1}),this.collidedPresents===this.chimneyHits.length&&this.showGameOver()}dropPresent(){if(0===this.remainingPresents||this.isRestarting)return;this.remainingPresents-=1;const e=this.presentGroup.create(this.arrow.x,this.arrow.y);e.setScale(.05),e.setCollideWorldBounds(!0),e.setBounce(.5,.5),e.setCircle(256),this.setText("remaining",`${this.remainingPresents}`)}createInfoElements(){const e={fontSize:"16px",color:"#fff",fontFamily:r};this.texts={remaining:this.add.text(30,13,`${this.remainingPresents}`,e),score:this.add.text(380,13,`${this.score}`,e)},this.add.image(10,20,"present").setScale(.04),this.add.image(362,20,"chimney").setScale(.04)}showGameOver(){this.isRestarting=!0,this.add.text(200,300,`Game Over\nYou scored ${this.score}`,{fontSize:"32px",color:"#fff",fontFamily:r,align:"center"}).setOrigin(.5,.5);const e=this.add.text(200,400,"Play again",{fontSize:"24px",color:"#fff",fontFamily:r,align:"center"}).setOrigin(.5,.5);e.setInteractive(),e.on("pointerdown",(()=>{for(let e=0;e<this.chimneyHits.length;e++)this.chimneyHits[e]=0;this.remainingPresents=8,this.scene.restart(),setTimeout((()=>{this.isRestarting=!1}),100)})),this.add.tween({targets:e,duration:250,scale:1.1,yoyo:!0,repeat:-1})}setText(e,t){this.texts[e].setText(t)}}const o={type:s.AUTO,width:400,height:600,parent:"game-container",backgroundColor:"#028af8",scale:{mode:s.Scale.FIT,autoCenter:s.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{debug:!1,gravity:{y:300}}},scene:[n]};new s.Game(o);