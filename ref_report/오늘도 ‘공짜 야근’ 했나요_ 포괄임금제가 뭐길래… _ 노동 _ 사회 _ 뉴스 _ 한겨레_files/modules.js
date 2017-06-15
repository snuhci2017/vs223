

temple.modules.MonetModule = ( function(_super,args) {
	__extends(MonetModule, _super);
	
	function MonetModule(config, banner) {
		this.version = "1.5";
		this.banner = banner;
		this.config = config;

		if (!window["Monet"]) {
			temple.utils.loadScript("https://ae.nflximg.net/monet/scripts/monet.min.js", this.buildRequest.bind(this));
			temple.utils.debug('Monet.js not found. Automatically loaded from MonetModule', 'green');
		} else {
			this.buildRequest();
		}

	}

	MonetModule.prototype.buildRequest = function() {
		Monet.initialize(Enabler, {  });
	    Monet.logEvent('MONET_INITIALIZED');
	    Monet.load(Monet.buildMonetRequest(), this.onMonetReady.bind(this), this.onMonetFailed.bind(this));
	}

	MonetModule.prototype.onMonetReady = function(dynamicContent) {
		this.data = dynamicContent;
		Monet.logEvent('MONET_ASSETS_LOADED');

		try {
			this.setDynamicVars();
		} catch(e) {

			Monet.logEvent('MONET_DATA_ERROR');
			this.onMonetFailed(e);
		}
		
	}


	MonetModule.prototype.onMonetFailed = function(errors) {
		temple.utils.loadJSON(Enabler.getUrl(this.config.backup), function(backupContent) {
			this.backupDataLoaded = true;
			this.data = backupContent;
			this.setDynamicVars();
		}.bind(this));

		Monet.logEvent('BACKUP_ASSETS_LOADED');
	}

	MonetModule.prototype.setDynamicVars = function() {
		this.dynamicElements = document.querySelectorAll('[data-dynamic]');
		if (document.body.hasAttribute('data-dynamic-exit')) {
			this.exitURLs = this.parseDataArray('exit');
		}
		if (temple.banner.config.variation === "rich") {
			temple.config.video.sources = this.parseDataArray('video');
		}
		for (var i = 0; i < this.dynamicElements.length; i++) {
			var d = this.dynamicElements[i].getAttribute('data-dynamic');
			d = eval('this.data.'+d);
			var svg = {};
			if (this.dynamicElements[i].nodeName == "IMG") {
				this.imagesToLoad = (this.imagesToLoad+1) || 1;
				this.dynamicElements[i].onload = this.imageLoaded.bind(this);
				this.dynamicElements[i].src = d;
			} else if (this.dynamicElements[i].nodeName == "svg") {
				this.imagesToLoad = (this.imagesToLoad+1) || 1;
				svg[i] = {xhr:new XMLHttpRequest(), id:i};
	        	svg[i].xhr.id = i;
	        	svg[i].xhr.onload = function(e) {
	        		var r = e.currentTarget.responseXML.documentElement;
	        		r.setAttribute('class', this.dynamicElements[e.currentTarget.id].getAttribute('class'));
					var id = this.dynamicElements[e.currentTarget.id].getAttribute('id');
	        		r.setAttribute('id', id);
	        		this.dynamicElements[e.currentTarget.id].parentNode.replaceChild(r, this.dynamicElements[e.currentTarget.id]);
	        		this.imageLoaded();
	        	}.bind(this);
	        	svg[i].xhr.open('GET', d, !0);
	        	svg[i].xhr.overrideMimeType("image/svg+xml");
				svg[i].xhr.send("");
			} else {
				this.dynamicElements[i].innerHTML = d;
			}
		}
		
		if (!this.imagesToLoad) this.initMonetModule();
	}

	MonetModule.prototype.imageLoaded = function imageLoaded(e) {
		this.imagesLoaded = this.imagesLoaded+1 || 1;
		if(this.imagesLoaded == this.imagesToLoad) {
			this.initMonetModule();
		}
	}

	MonetModule.prototype.parseDataArray = function parseDataArray(a) {
		var s = [];
		var v = document.body.getAttribute('data-dynamic-'+a);
		v = v.split(',');
		for (var i = 0; i < v.length; i++) {
			var d = eval('this.data.'+v[i]).split(',');
			s = s.concat(d);
		}
		return s;
	}

	MonetModule.prototype.initMonetModule = function() {
		this.isReady();
	}
			
	MonetModule.prototype.trackMonetVideoEvent_PLAY 				= function(event){	
		Monet.logEvent("VIDEO_PLAY", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});
	}
	
	MonetModule.prototype.trackMonetVideoEvent_PAUSE 				= function(event){	
		Monet.logEvent("VIDEO_PAUSE", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});	
	}

	MonetModule.prototype.trackMonetVideoEvent_STOP 				= function(event){
		Monet.logEvent("VIDEO_STOP", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});
	}

	MonetModule.prototype.trackMonetVideoEvent_MUTE 				= function(event){	
		Monet.logEvent("VIDEO_MUTE", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});
	}
	
	MonetModule.prototype.trackMonetVideoEvent_UNMUTE 				= function(event){	
		Monet.logEvent("VIDEO_UNMUTE", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});
	}

	MonetModule.prototype.trackMonetVideoEvent_FIRST_QUARTER 		= function(event){		
		Monet.logEvent("VIDEO_FIRST_QUART", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});
	}		
	
	MonetModule.prototype.trackMonetVideoEvent_SECOND_QUARTER 		= function(event){		
		Monet.logEvent("VIDEO_SECOND_QUART", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});	
	}			
	
	MonetModule.prototype.trackMonetVideoEvent_THIRD_QUARTER 		= function(event){		
		Monet.logEvent("VIDEO_THIRD_QUART", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.video.getCurrentTime()
		});	
	}

	MonetModule.prototype.trackMonetVideoEvent_COMPLETE 			= function(event){		
		Monet.logEvent("VIDEO_COMPLETE", {	"url" 	: "https://www.youtube.com/watch?v="+event.target.currentVideo.source,
			"pos" 	: event.target.currentVideo.duration
		});
	}

	MonetModule.prototype.trackMonetEvent_CLICK 					= function(event) {
		var t = event.target.id || event.target.classList[0];

		console.log(event.target.classList[0])
		Monet.logEvent("CLICK", {"src":t, "coords":{"x":event.clientX, "y":event.clientY}});
	}

	MonetModule.prototype.trackMonetEvent_EXIT						= function(event){		
		TweenMax.delayedCall(0.1, Monet.logEvent, ["AD_EXIT", {"url" : event}]);
	}

	MonetModule.prototype.trackMonetExpandableEvent_EXPAND 			= function(event){		
		Monet.logEvent("UNIT_RESIZE", {	"type" 	: "expand",
			"Size" 	: { "width": this.banner.config.expandable.width, "height": this.banner.config.expandable.height}
		});
	}
	MonetModule.prototype.trackMonetExpandableEvent_COLLAPSE 		= function(event){		
		Monet.logEvent("UNIT_RESIZE", {	"type" 	: "collapse",
			"Size" 	: { "width": this.banner.config.size.width, "height": this.banner.config.size.height}
		});
	}
	


	MonetModule.prototype.addTrackingListeners = function(controller) {
		this.banner.banner.addEventListener("click", this.trackMonetEvent_CLICK.bind(this));
		this.banner.addEventListener(temple.events.EXIT, this.trackMonetEvent_EXIT.bind(this));
		
		if(controller){
			for(var i = 0; i < controller.sources.length; i++){
				controller.sources[i].addEventListener(temple.events.VideoEvents.COMPLETE, 			this.trackMonetVideoEvent_COMPLETE.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.CLOSE, 			this.trackMonetVideoEvent_STOP.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.STOP, 				this.trackMonetVideoEvent_STOP.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.MUTE, 				this.trackMonetVideoEvent_MUTE.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.UNMUTE, 			this.trackMonetVideoEvent_UNMUTE.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.FIRST_QUARTER, 	this.trackMonetVideoEvent_FIRST_QUARTER.bind(this),false);
				controller.sources[i].addEventListener(temple.events.VideoEvents.SECOND_QUARTER, 	this.trackMonetVideoEvent_SECOND_QUARTER.bind(this),false);
				controller.sources[i].addEventListener(temple.events.VideoEvents.THIRD_QUARTER, 	this.trackMonetVideoEvent_THIRD_QUARTER.bind(this),false);
				controller.sources[i].addEventListener(temple.events.VideoEvents.PLAY, 				this.trackMonetVideoEvent_PLAY.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.PAUSE, 			this.trackMonetVideoEvent_PAUSE.bind(this));
			}
		}

		if(this.banner.config.expandable){
			if(!this.banner.lightboxModule){
				this.banner.expandingModule.addEventListener(temple.events.EXPAND, this.trackMonetExpandableEvent_EXPAND.bind(this));
    			this.banner.expandingModule.addEventListener(temple.events.COLLAPSE, this.trackMonetExpandableEvent_COLLAPSE.bind(this));
			} else {
				this.banner.lightboxModule.addEventListener(temple.events.EXPAND, this.trackMonetExpandableEvent_EXPAND.bind(this));
    			this.banner.lightboxModule.addEventListener(temple.events.COLLAPSE, this.trackMonetExpandableEvent_COLLAPSE.bind(this));
			}
			
		}		
	}	

	return MonetModule;

} )( temple.core.EventDispatcher );

temple.modules.NetflixCtaModule = ( function( _super ) {
	__extends(NetflixCtaModule, _super);
	
	function NetflixCtaModule(data, banner, id) {
		this.version = '1.5';
		this.banner = banner;
		this.id = id || 0;
		this.size = data.size || 40;
		this.color = data.color || ['#e50914', '#ffffff'];
		this.element = data.element || data;
		this.element.classList.add('ctaModule'+id);
		if(data.textColor){
			this.textColor = data.textColor
		} else {
			this.textColor = this.color.slice(0);
			this.textColor.reverse();
		}

		this.cta_border = document.createElement('div');
		this.cta_border.className = 'cta_border';

		this.fill = document.createElement('div');
		this.fill.className = 'cta_fill';
		this.copy = document.createElement('div');
		this.copy.className = 'cta_copy';
		this.arrow = document.createElement('div');
		this.arrow.className = 'cta_arrow';
		this.arrow.innerHTML = '›';

		var c = '.ctaModule'+id;

		this.element.appendChild(this.fill);
		this.element.appendChild(this.copy);
		this.element.appendChild(this.cta_border);

		temple.utils.createStyle(c, 'position:absolute;background-color:'+this.color[0]+';color:'+this.textColor[0]+';font-family:"proximanova_bold";text-align:center;line-height:'+this.size+'px;overflow: hidden;font-size:'+this.size+'px;');
		temple.utils.createStyle(c+' .cta_fill', 'position:absolute;width:100%;height:100%;top:0;left:-100%;background-color:'+this.color[1]+';');
		
		temple.utils.createStyle(c+' .cta_copy', 	'position:absolute;' + 
													'width:100%;' +
													'left:0;' +
													//'padding:0px 18px 0px 6px;' +
													'padding:4px 22px 4px 8px;' +
													'line-height:'+this.size+'px;' +
													'margin-top:1px;' + 
													'top:50%;');
		

		temple.utils.createStyle(c+' .cta_arrow', 	'position:absolute;'+
													'top:50%;'+
													'right:10px;'+
													'font-size:16px !important;'+
													//'margin-top:-1px;');
													'margin-top:-2px;');

		TweenMax.set([this.copy,this.arrow], {y:'-50%'});

		if (data.dynamic) {
			this.copy.setAttribute('data-dynamic', data.dynamic);
		}

		if (data.text) {
			this.setText(data.text);
		}

		this.element.addEventListener('mouseover', this.onOver.bind(this));
		this.element.addEventListener('mouseout', this.onOut.bind(this));

		this.isReady();
	}
	


	NetflixCtaModule.prototype.setText = function(text, size) {
		this.copy.innerHTML = text;
		var s = size || this.size;
		this.copy.style.fontSize = s + 'px';
		var lh = Math.round(s+1);
		lh = !(lh == parseFloat(lh)? !(lh%2) : void 0) ? lh - 1 : lh;
		this.copy.style.lineHeight = lh + 'px';

		
		this.currentWidth = this.element.offsetWidth;
		this.maxWidth = parseInt(window.getComputedStyle(this.element,null).getPropertyValue("max-width"));
		
		console.log(this.currentWidth)
		console.log(this.maxWidth)



		if (this.copy.offsetHeight > this.element.offsetHeight) {

			console.log("Too Small")

			while (this.copy.offsetHeight > this.element.offsetHeight && this.currentWidth <= this.maxWidth) {
				
				this.currentWidth += 1;
				this.element.style.width = this.currentWidth + "px";
				console.log("Setting new width to: " + this.currentWidth);
			}
		}

		
		if (this.copy.offsetHeight > this.element.offsetHeight) {
			//this.element.style.width = null;

			while (this.copy.offsetHeight > this.element.offsetHeight) {

				if(this.element.offsetHeight === 0){
					temple.utils.debug('ERROR NetflixCtaModule : container height = 0', 'pink');
					break;
				}

				s -= .2;
				this.copy.style.fontSize = s + 'px';
				var lh = Math.round(s+1);
				lh = !(lh == parseFloat(lh)? !(lh%2) : void 0) ? lh - 1 : lh;
				this.copy.style.lineHeight = lh + 'px';
			}
		}

		console.log()
		
		this.copy.appendChild(this.arrow);
	}
	
	NetflixCtaModule.prototype.onOver = function() {
		TweenMax.to(this.fill, .5, {x:'100%', ease:Expo.easeOut, force3D:true});
		TweenMax.to(this.copy, .5, {color:this.textColor[1], ease:Expo.easeOut, force3D:true});
	}
	
	NetflixCtaModule.prototype.onOut = function() {
		TweenMax.to(this.fill, .5, {x:'0%', ease:Expo.easeOut, force3D:true});
		TweenMax.to(this.copy, .5, {color:this.textColor[0], ease:Expo.easeOut, force3D:true});
	}

	return NetflixCtaModule;

})( temple.core.EventDispatcher );
