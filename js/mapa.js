/* global google */

let map;
const centerMap = { lat: -5.749025, lng: -35.2626732 };
var marker;
var infowindow;

class LocalControl {
    constructor(map) {
        this.controlDiv = document.createElement('div');
        this.controlUI = document.createElement('div');
        this.controlText = document.createElement('div');

        this.controlUI.style.backgroundColor = 'rgba(255,255,255)';
        this.controlUI.style.border = '2px solid #ebebeb';
        this.controlUI.style.borderRadius = '15px';
        this.controlUI.style.padding = '15px';
        this.controlUI.style.margin = '15px';
        this.controlUI.className = 'a';


        this.controlDiv.appendChild(this.controlUI);

        this.controlText.style.fontSize = '16px';
        this.controlText.style.textAlign = 'center';
        this.controlText.style.lineHeight = '20px';
        this.controlText.style.color = '#333';
        this.controlText.style.padding = '9px';
        this.controlText.className = 'botao';

        this.controlUI.appendChild(this.controlText);

        this.controlUI.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) { // callback de sucesso
                        // ajusta a posiçãoo do marker para a localizaÃ§Ã£o do usuário
                        marker = new google.maps.Marker({
                            map: map,
                            draggable: false,
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                            icon: 'img/mapa/user.png'
                        });
                        infowindow = new google.maps.InfoWindow({
                            content: 'Localização'
                        });

                        marker.addListener('click', function() {
                            infowindow.open(map, marker);
                        });
                        map.panTo(marker.position);
                        map.setZoom(16);
                    },
                    function(error) { // callback de erro
                        alert('Erro ao obter localização!');
                        console.log('Erro ao obter localização.', error);
                    });
                this.controlDiv.style.display = 'none';
            } else {
                console.log('Navegador não suporta Geolocalização!');
            }
        });
    }
}

function marcadores() {

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    $.getJSON('js/pontos.json', function(pontos) {

        $.each(pontos, function(index, pontos) {

            if (pontos.status == true) {
                icon = 'img/mapa/valid.png';
            } else {
                icon = 'none';
            }

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(pontos.Latitude, pontos.Longitude),
                animation: google.maps.Animation.DROP,
                map: map,
                icon: icon
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(pontos.nome);
                    infowindow.open(map, marker);
                };
            })(marker, i))

            if (marker.icon == 'none'){
                marker.setMap(null)
            }
        });
    });

}

function initMap() {
    const mapOptions = {
        center: centerMap,
        zoom: 13.5,
        disableDefaultUI: true,
        styles: [{
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#d3d3d3"
                }]
            },
            {
                "featureType": "transit",
                "stylers": [{
                        "color": "#808080"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#b3b3b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#ffffff"
                    },
                    {
                        "weight": 1.8
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#d7d7d7"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#ebebeb"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#a7a7a7"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#efefef"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#696969"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#737373"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#d6d6d6"
                }]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {},
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#dadada"
                }]
            }
        ]
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    marcadores();

    const centerControl = new LocalControl(map);
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControl.controlDiv);
}