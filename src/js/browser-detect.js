/**
 * Created by jag on 10/10/2014.
 */

var msg = '';

var browser_support = 'This web application makes an intensive use of new web technologies and standards like HTML5,Web Components.'+
                      'Browsers that are fully supported for this site are: Chrome 22+, Firefox 24+, Safari 6+ and Opera 15+'+
                      'Older browser like Chrome 21-, Firefox 23- or Internet Explorer 10 and 11 may give rise to errors. Internet Explorer 6,7,8 and 9 are not supported at all.'

var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var fullVersion  = ''+parseFloat(navigator.appVersion);
var majorVersion = parseInt(navigator.appVersion,10);
var nameOffset,verOffset,ix;

// In Opera, the true version is after "Opera" or after "Version"
if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset+6);
    if ((verOffset=nAgt.indexOf("Version"))!=-1)
        fullVersion = nAgt.substring(verOffset+8);
    majorVersion = getMajorVersion(fullVersion);
    console.log(majorVersion)
    if(majorVersion <= 14){
        msg = browser_support;
    }
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset+5);
    majorVersion = getMajorVersion(fullVersion);
    if(majorVersion <= 11){
        msg = browser_support;
    }
}
// In Chrome, the true version is after "Chrome"
else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset+7);
    majorVersion = getMajorVersion(fullVersion);
    console.log(majorVersion)
    if(majorVersion <= 21){
        msg = browser_support;
    }
}
// In Safari, the true version is after "Safari" or after "Version"
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset+7);
    if ((verOffset=nAgt.indexOf("Version"))!=-1)
        fullVersion = nAgt.substring(verOffset+8);
    majorVersion = getMajorVersion(fullVersion);
    console.log(majorVersion)
    if(majorVersion <= 5){
        msg = browser_support;
    }
}
// In Firefox, the true version is after "Firefox"
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset+8);
    majorVersion = getMajorVersion(fullVersion);
    console.log(majorVersion)
    if(majorVersion <= 23){
        msg = browser_support;
    }
}
// In most other browsers, "name/version" is at the end of userAgent
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
    (verOffset=nAgt.lastIndexOf('/')) )
{
    browserName = nAgt.substring(nameOffset,verOffset);
    fullVersion = nAgt.substring(verOffset+1);
    if (browserName.toLowerCase()==browserName.toUpperCase()) {
        browserName = navigator.appName;
    }
}

if(msg){
    alert('Sorry our site does not support this browser version \n'+msg)
}




function getMajorVersion(fullVersion) {

    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
        fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
        fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion,10);
    }

    return majorVersion
}



