/*KAISARCODE ROTATE DIAL ***************************************************
*                                                                         *
*   Copyright (C) 2012-2014  KaisarCode.com                               *
*                                                                         *
*   This program is free software: you can redistribute it and/or modify  *
*   it under the terms of the GNU General Public License as published by  *
*   the Free Software Foundation, either version 3 of the License, or     *
*   (at your option) any later version.                                   *
*                                                                         *
*   This program is distributed in the hope that it will be useful,       *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
*   GNU General Public License for more details.                          *
*                                                                         *
*   You should have received a copy of the GNU General Public License     *
*   along with this program.  If not, see <http://www.gnu.org/licenses/>. *
*                                                                         *
***************************************************************************/

var currentKey = 0;
var rotateWheel=function(elem, keyIsNumber){
    keyIsNumber = (typeof keyIsNumber === 'undefined') ? true : keyIsNumber;
    var key = 0;
    var output={};
    //Preventing elem to being selected on IE
    if(document.all && !window.opera) elem.setAttribute("unselectable","on");
    //Public Properties
    output.rad=0;
    output.deg=0;
    output.per=0;
    output.fullRad=0;
    output.fullDeg=0;
    output.fullPer=0;
    output.spin=0;
    output.clock=false;
    //Private properties
    var drag=false;
    var pos=[];
    var size=[];
    var axis=[];
    var cursor=[];
    var rad=0;
    var lastRad=0;
    var lastPer=0;
    var lastFullRad=0;
    var maxRad=6.283185307179586;
    var maxDeg=360;
    var maxPer=100;
    var Dx=[];
    var Dy=[];
    var dummy;
    updateKey();
    //Public Methods
    output.onchange=function(e){
        updateKey();
    };
    //Private Methods
    function updateKey() {
        // set the value of the cipher key based on the current rotation
        var keyText = document.getElementById("cipher-key");
        //calculate value of key
        currentKey = (26 - (Math.round((output.deg % 360) / (360 / 26)))) % 26;
        key = currentKey;
        keyText.textContent = /*keyIsNumber ? key : */String.fromCharCode(key + "A".charCodeAt(0));
    }

    function snapToLetter(e) {
        //setting control variables
        var cursorRad;
        var rotationRad;
        cursorRad=getAngle(e);
        // set rotation to nearest letter
        var rotationRad = (maxRad/26) * -key;
        rad = cursorRad;

        //applying rotation to element
        elem.style.transform="rotate("+rotationRad+"rad)";
        elem.style.MozTransform="rotate("+rotationRad+"rad)";
        elem.style.WebkitTransform="rotate("+rotationRad+"rad)";
        elem.style.OTransform="rotate("+rotationRad+"rad)";
        elem.style.MsTransform="rotate("+rotationRad+"rad)";

        //rotation Matrix for IExplorer
        var iecos = Math.cos(cursorRad);
        var iesin = Math.sin(cursorRad);
        Dx[0]=-(size[0]/2)*iecos + (size[1]/2)*iesin + (size[0]/2);
        Dx[1]=-(size[0]/2)*iesin - (size[1]/2)*iecos + (size[1]/2);
        elem.style.filter  ="progid:DXImageTransform.Microsoft.Matrix(M11="+iecos+", M12="+-iesin+", M21="+iesin+", M22="+iecos+", Dx="+Dx[0]+", Dy="+Dx[1]+", SizingMethod=auto expand)";
        elem.style.msFilter="progid:DXImageTransform.Microsoft.Matrix(M11="+iecos+", M12="+-iesin+", M21="+iesin+", M22="+iecos+", Dx="+Dx[0]+", Dy="+Dx[1]+", SizingMethod=auto expand)";

        //assigning values to public properties
        output.rad=rotationRad;
        output.deg=maxDeg*output.rad/(2*Math.PI);
        output.per=(output.rad*maxPer)/maxRad;
        
    }
    function preventDefault(e){
        //prevent event's default action
        if(window.event) e=window.event;
        if(e.preventDefault){e.preventDefault()}else{e.returnValue=false};
    }
    function getPos(elem){
        //get the position [left,top] relative to whole document
        var tmp=elem;
        var left=tmp.offsetLeft;
        var top=tmp.offsetTop;
        while (tmp=tmp.offsetParent) left += tmp.offsetLeft;
        tmp=elem;
        while(tmp=tmp.offsetParent) top+=tmp.offsetTop;
        return [left,top];
    }
    function getSize(elem){
        //return the size [width,height] of the element
        return [elem.offsetWidth,elem.offsetHeight];
    }
    function getAxis(elem){
        //return the center point [left,top] of the element
        return [getPos(elem)[0]+getSize(elem)[0]/2,getPos(elem)[1]+getSize(elem)[1]/2];
    }
    function getCursorPos(e){
        //return the cursor's position [x,y]
        var cursorPos;
        if(window.event) e=window.event;
        if(e.clientX) cursorPos=[e.clientX,e.clientY];
        if(e.pageX) cursorPos=[e.pageX,e.pageY];
        try{if(e.targetTouches[0]) cursorPos=[e.targetTouches[0].pageX,e.targetTouches[0].pageY];}catch(err){};
        return cursorPos;
    }
    function getAngle(e){
        //getting rotation angle by Arc Tangent 2
        var rad;
        pos=getPos(elem);
        size=getSize(elem);
        axis=getAxis(elem);
        cursor=getCursorPos(e);
        try{rad=Math.atan2(cursor[1]-axis[1],cursor[0]-axis[0])}catch(err){};
        //correct the 90° of difference starting from the Y axis of the element
        rad+=maxRad/4;
        //transform opposite angle negative value, to possitive
        if(rad<0) rad+=maxRad;
        return rad;
    }
    function setDrag(e,bool){
        //set or unset the drag flag
        if(bool){
            preventDefault(e);
            rad=getAngle(e);
            drag=true;
        }else{
            drag=false;
            snapToLetter(e);
        }
    }
    function rotate(e){
        //Rotate the element
        if(drag){
            //setting control variables
            var cursorRad;
            var relativeRad;
            var rotationRad;
            cursorRad=getAngle(e);
            relativeRad=cursorRad-rad;
            var rotationRad=lastRad+relativeRad;
            if(isNaN(rotationRad)) rotationRad=lastRad;
            if(rotationRad<0) rotationRad=maxRad;
            if(rotationRad>maxRad) rotationRad=0;
            
            rad=cursorRad;
            
            //applying rotation to element
            elem.style.transform="rotate("+rotationRad+"rad)";
            elem.style.MozTransform="rotate("+rotationRad+"rad)";
            elem.style.WebkitTransform="rotate("+rotationRad+"rad)";
            elem.style.OTransform="rotate("+rotationRad+"rad)";
            elem.style.MsTransform="rotate("+rotationRad+"rad)";
            
            //rotation Matrix for IExplorer
			var iecos = Math.cos(cursorRad);
			var iesin = Math.sin(cursorRad);
			Dx[0]=-(size[0]/2)*iecos + (size[1]/2)*iesin + (size[0]/2);
			Dx[1]=-(size[0]/2)*iesin - (size[1]/2)*iecos + (size[1]/2);
			elem.style.filter  ="progid:DXImageTransform.Microsoft.Matrix(M11="+iecos+", M12="+-iesin+", M21="+iesin+", M22="+iecos+", Dx="+Dx[0]+", Dy="+Dx[1]+", SizingMethod=auto expand)";
			elem.style.msFilter="progid:DXImageTransform.Microsoft.Matrix(M11="+iecos+", M12="+-iesin+", M21="+iesin+", M22="+iecos+", Dx="+Dx[0]+", Dy="+Dx[1]+", SizingMethod=auto expand)";

            //assigning values to public properties
            output.rad=rotationRad;
            output.deg=maxDeg*output.rad/(2*Math.PI);
            output.per=(output.rad*maxPer)/maxRad;
            
            if((lastPer<=100 && lastPer>=60) && (output.per>=0 && output.per<=30)) output.spin++;
            if((lastPer<=30 && lastPer>=0) && (output.per>=60 && output.per<=100)) output.spin--;
            
            output.fullRad=output.rad+(maxRad*output.spin);
            output.fullDeg=output.deg+(maxDeg*output.spin);
            output.fullPer=output.per+(maxPer*output.spin);
            
            if(lastFullRad<output.fullRad) output.clock=true;
            if(lastFullRad>output.fullRad) output.clock=false;
            
            lastRad=rotationRad;
            lastPer=output.per;
            lastFullRad=output.fullRad;
            output.onchange(e);
        }
    }
    
    //Listen events
    if(elem.attachEvent){
		
		elem.attachEvent('onmousedown',function(){setDrag(0,true)});
		document.attachEvent('onmouseup',function(){setDrag(0,false)});
		document.attachEvent('onmousemove',function(){rotate(0)});
		
	}else if(elem.addEventListener){
		
		elem.addEventListener('mousedown',function(e){setDrag(e,true)});
		document.addEventListener('mouseup',function(e){setDrag(e,false)});
		document.addEventListener('mousemove',function(e){rotate(e)});
			
		try{elem.addEventListener('touchstart',function(e){setDrag(e,true);})}catch(err){}
		try{document.addEventListener('touchend',function(e){setDrag(e,false);})}catch(err){}
		try{document.addEventListener('touchmove',function(e){rotate(e)})}catch(err){}
		
	}
    
	//Fixing black box issue on IE9
	dummy=document.createElement("div");
	dummy.innerHTML='<!--[if gte IE 9]><br /><![endif]-->';
	if(dummy.getElementsByTagName("br").length==1) elem.style.filter="none";
	delete dummy;
    
	//Output
	return output;
}

var createCipherWheel = function(elem, keyIsNum) {
    var outerWheel = document.createElement("img");
    outerWheel.setAttribute("src", "../img/outerwheel.png");
    outerWheel.setAttribute("class", "outer-wheel");
    var innerWheel = document.createElement("img");
    innerWheel.setAttribute("src", "../img/innerwheel.png");
    innerWheel.setAttribute("alt", "inner cipher wheel");
    innerWheel.setAttribute("class", "inner-wheel");
    var cipherText = document.createElement("img");
    cipherText.setAttribute("src", "../img/ciphertext.png");
    cipherText.setAttribute("alt", "Cipher text");
    cipherText.setAttribute("class", "inner-wheel");
    var plainText = document.createElement("img");
    plainText.setAttribute("src", "../img/plaintext.png");
    plainText.setAttribute("alt", "Plain text");
    plainText.setAttribute("class", "outer-wheel");
    var keyDisplay = document.createElement("div");
    keyDisplay.setAttribute("id", "key-display");
    var keyIcon = document.createElement("i");
    keyIcon.setAttribute("class", "fa fa-key");
    keyIcon.setAttribute("style", "margin-right: 10px;");
    keyDisplay.appendChild(keyIcon);
    var keyValue = document.createElement("span");
    keyValue.setAttribute("id", "cipher-key");
    var valueText = document.createTextNode(0);
    keyValue.appendChild(valueText);
    keyDisplay.appendChild(keyValue);

    // var cipherHeight = outerWheel.width;
    // elem.style.minHeight = cipherHeight+"px";

    elem.appendChild(plainText);
    elem.appendChild(cipherText);
    elem.appendChild(outerWheel);
    elem.appendChild(innerWheel);
    elem.appendChild(keyDisplay);
    var spinWheel = rotateWheel(innerWheel, keyIsNum);

}
var cipherWheel = null;
if (document.getElementById("cipher-wheel") != null) {
    var cipherWheel = createCipherWheel(document.getElementById("cipher-wheel"), true);
} else if (document.getElementById("vigenere-wheel") != null) {
    var cipherWheel = createCipherWheel(document.getElementById("vigenere-wheel"), false);
}

$(window).on("resize", function() {
    cipherWheel = null;
    if (document.getElementById("cipher-wheel") != null) {
        var cipherWheel = document.getElementById("cipher-wheel");
    } else if (document.getElementById("vigenere-wheel") != null) {
        var cipherWheel = document.getElementById("vigenere-wheel");
    }
    if (cipherWheel != null) {
        var cipherHeight = cipherWheel.firstElementChild.offsetWidth;
        cipherWheel.style.minHeight = cipherHeight+"px";
    }
});

$(window).trigger('resize');