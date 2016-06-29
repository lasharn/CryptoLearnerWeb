/**
 * Created by lwwe379 on 29/06/2016.
 */

$('#substitution-mapping').append("" +
    "<div class='mapping-row'>" +
        "<div class='mapping'><div class='keyLetter'>" +
            "<i class='fa fa-unlock fa-lg'></i>" +
        "</div>" +
        "<div class='cipherLetter'>" +
            "<i class='fa fa-lock fa-lg'></i>" +
        "</div>" +
    "</div>" +
    "<div class='mapping' ng-repeat='map in mapping'>" +
        "<div class='keyLetter'>{{map.keyLetter}}</div>" +
        "<div class='cipherLetter'>{{map.cipherLetter}}</div>" +
    "</div>" +
    "</div>");
