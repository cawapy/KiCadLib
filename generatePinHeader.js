//
// preparation:
//      cscript /s /nologo     permanently disables printing logo
//      cscript /h:cscript       sets console scripting host as default (requires admin)
//

//var numberPadsX = 3;
//var numberPadsY = 7;
//var alternativeNumbering = false;
//var isAngle = false;

var numberPadsX = WScript.Arguments(0);
var numberPadsY = WScript.Arguments(1);
var alternativeNumbering = WScript.Arguments(2);
var isAngle = WScript.Arguments(3);

var padSizeMm = 1.6;
var rasterMm = 2.54;




straightVsAngle = "straight";
StraightVsAngle = "Straight";
orientation = "Vertical";
if (isAngle) {
    straightVsAngle = "angle";
    StraightVsAngle = "Angle";
    orientation = "Horizontal";
}

numbering = "conventional numbering";
Numbering = "ConvNumbering";
if (alternativeNumbering) {
    numbering = "alternative numbering";
    Numbering = "AltNumbering";
}

function pad2(number) {
    return (number < 10 ? "0" : "") + number;
}

var centerX = (numberPadsX-1) * rasterMm / 2;
var centerY = (numberPadsY-1) * rasterMm / 2;

WScript.Echo("(module Pin_Header_"+StraightVsAngle+"_Shrouded_"+numberPadsX+"x"+pad2(numberPadsY)+"_Pitch"+rasterMm+"mm_"+Numbering+" (layer F.Cu) (tedit 5BDC1C8B)");
WScript.Echo("  (descr \"Through hole shrouded "+straightVsAngle+" pin header, "+numberPadsX+"x"+pad2(numberPadsY)+", "+rasterMm+"mm pitch, double rows, "+numbering+"\")");
WScript.Echo("  (tags \"Through hole shrouded "+straightVsAngle+" pin header THT "+numberPadsX+"x"+pad2(numberPadsY)+" "+rasterMm+"mm double row, "+numbering+"\")");
WScript.Echo("  (fp_text reference REF** (at "+centerX+" -6.096) (layer F.SilkS)");
WScript.Echo("    (effects (font (size 1 1) (thickness 0.15)))");
WScript.Echo("  )");
WScript.Echo("  (fp_text value Pin_Header_"+StraightVsAngle+"_Shrouded_"+numberPadsX+"x"+pad2(numberPadsY)+"_Pitch"+rasterMm+"mm_"+Numbering+" (at 4.826 5.08 90) (layer F.Fab) hide");
WScript.Echo("    (effects (font (size 1 1) (thickness 0.15)))");
WScript.Echo("  )");
WScript.Echo("  (fp_text user %R (at "+centerX+" 5.08 90) (layer F.Fab)");
WScript.Echo("    (effects (font (size 1 1) (thickness 0.15)))");
WScript.Echo("  )");

lenX = rasterMm * (numberPadsX-1);
lenY = rasterMm * (numberPadsY-1);

{
    // Silk Screen
    delta = rasterMm/2 + 0.06;
    endY = lenY + delta;
    endX = lenX + delta;
    WScript.Echo("  (fp_line (start "+(-delta)+" "+(-delta)+") (end 0 "+(-delta)+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+(-delta)+" 0) (end "+(-delta)+" "+(-delta)+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+(rasterMm/2)+" "+(-delta)+") (end "+endX+" "+(-delta)+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+(rasterMm/2)+" "+(rasterMm/2)+") (end "+(rasterMm/2)+" "+(-delta)+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+(-delta)+" "+(rasterMm/2)+") (end "+(rasterMm/2)+" "+(rasterMm/2)+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+endX+" "+(-delta)+") (end "+endX+" "+endY+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+(-delta)+" "+(rasterMm/2)+") (end "+(-delta)+" "+(centerY-rasterMm)+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+(-delta)+" "+endY+") (end "+endX+" "+endY+") (layer F.SilkS) (width 0.12))");
    WScript.Echo("  (fp_line (start "+(-delta)+" "+(centerY+rasterMm)+") (end "+(-delta)+" "+endY+") (layer F.SilkS) (width 0.12))");
}


{
    // fab / crtyd
    innerDelta = rasterMm/2;
    innerEndX = lenX + innerDelta;
    innerEndY = lenY + innerDelta;

    outerDeltaX = 3.13;
    outerDeltaY = 5.07;
    outerEndX = lenX + outerDeltaX;
    outerEndY = lenY + outerDeltaY;

    if (isAngle) {
        // outer box
        RectXYXY(lenX+1.8, -outerDeltaY, lenX+10.6, lenY+outerDeltaY, "F.Fab", 0.1);

        // inner box
        RectDxDy(innerDelta, innerDelta, "F.Fab", 0.1);

        // ausschnitt aus stecker
        RectXYXY(lenX+3.7, centerY-2.25, lenX+10.6, centerY+2.25, "F.Fab", 0.15);

        // pin marker dreieck
        topX = lenX + 5.588;
        baseX = topX + 3.81;
        baseH = 1.016;
        WScript.Echo("  (fp_line (start "+baseX+" "+baseH+") (end "+topX+" 0) (layer F.Fab) (width 0.15))");
        WScript.Echo("  (fp_line (start "+topX+" 0) (end "+baseX+" "+(-baseH)+") (layer F.Fab) (width 0.15))");
        WScript.Echo("  (fp_line (start "+baseX+" "+(-baseH)+") (end "+baseX+" "+baseH+") (layer F.Fab) (width 0.15))");

        RectXYXY(-1.143, -1.143, lenX+1.65, lenY+1.143, "F.CrtYd", 0.15); // pins
        RectXYXY(lenX+1.65, -5.27, lenX+10.76, lenY+5.27, "F.CrtYd", 0.15); // housing
    }
    else {
        // inner box
        RectDxDy(innerDelta, innerDelta, "F.Fab", 0.1);
        // outer box
        RectDxDy(outerDeltaX, outerDeltaY, "F.Fab", 0.05);

        // mark arrow
        WScript.Echo("  (fp_line (start -2.794 -0.508) (end "+(-innerDelta)+" 0) (layer F.Fab) (width 0.1))");
        WScript.Echo("  (fp_line (start -2.794 0.508) (end -2.794 -0.508) (layer F.Fab) (width 0.1))");
        WScript.Echo("  (fp_line (start "+(-innerDelta)+" 0) (end -2.794 0.508) (layer F.Fab) (width 0.1))");

        RectDxDy(3.33, 5.27, "F.CrtYd", 0.05);
    }
}

function RectDxDy(deltaX, deltaY, layer, width) {
    RectXYXY(-deltaX, -deltaY, lenX+deltaX, lenY+deltaY, layer, width);
}

function RectXYXY(x1, y1, x2, y2, layer, width) {
    WScript.Echo("  (fp_line (start "+x2+" "+y1+") (end "+x1+" "+y1+") (layer "+layer+") (width "+width+"))");
    WScript.Echo("  (fp_line (start "+x1+" "+y1+") (end "+x1+" "+y2+") (layer "+layer+") (width "+width+"))");
    WScript.Echo("  (fp_line (start "+x1+" "+y2+") (end "+x2+" "+y2+") (layer "+layer+") (width "+width+"))");
    WScript.Echo("  (fp_line (start "+x2+" "+y2+") (end "+x2+" "+y1+") (layer "+layer+") (width "+width+"))");
}


var outerMaxX = 1;
var innerMaxX = numberPadsX;
if (alternativeNumbering) {
    outerMaxX = numberPadsX;
    innerMaxX = 1;
}
var padId = 1;
for (var xo = 0; xo<outerMaxX; xo++) {
    for (var y = 0; y<numberPadsY; y++) {
        for (var xi = 0; xi<innerMaxX; xi++) {
            var x = xo + xi;
            ThruHolePad(padId, x * rasterMm, y * rasterMm, padSizeMm);
            padId++;
        }
    }
}

function ThruHolePad(id, x, y, size) {
    // (pad 1 thru_hole oval (at 0 0) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask))
    WScript.Echo("  (pad "+id+" thru_hole oval (at "+x+" "+y+") (size "+size+" "+size+") (drill 1) (layers *.Cu *.Mask))");
}

WScript.Echo("  (model ${KISYS3DMOD}/Connector_IDC.3dshapes/IDC-Header_"+numberPadsX+"x"+pad2(numberPadsY)+"_P"+rasterMm+"mm_"+orientation+".step");
WScript.Echo("    (at (xyz 0 0 0))");
WScript.Echo("    (scale (xyz 1 1 1))");
WScript.Echo("    (rotate (xyz 0 0 0))");
WScript.Echo("  )");
WScript.Echo(")");

