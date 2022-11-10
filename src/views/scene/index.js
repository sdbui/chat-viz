import './styles.css';
import { useRef, useLayoutEffect } from 'react';
import { io } from 'socket.io-client';
import * as d3 from 'd3';

const socket = io('http://localhost:4000')

function Scene() {

    const path1Ref = useRef();
    const path2Ref = useRef();
    const svgRef = useRef();

    const paths = [
        path1Ref,
        path2Ref,
    ];

    useLayoutEffect(() => {

        socket.on('connect', () => console.log('socket connection'));
        socket.on('disconnect', ()=> console.log('disconnected'));


        socket.on('message-add', (msg) => {
            const svg = d3.select(svgRef.current);

            // create a node add to svg and animate
            let path = getRandomPath(paths).current;
            let startingPoint = path.getPointAtLength(0);
            
            svg.append('circle')
                .attr('cx', startingPoint.x)
                .attr('cy', startingPoint.y)
                .attr('r', 25)
                .transition()
                .delay(250)
                .duration(1500)
                .ease(d3.easeLinear)
                .tween('pathTween', function (){ return pathTween(path)})
                .remove();
            
                function pathTween(path) {
                    let length = path.getTotalLength();
                    let r = d3.interpolate(0,length); // set up interpolation from 0 to path length
                    return function(t) {
                        let point = path.getPointAtLength(r(t)); // get th enext point along the path
                        d3.select(this) // select circle
                            .attr('cx', point.x) // update cx
                            .attr('cy', point.y) // update cy
                    }
                }

        })

    }, []);


    return (
        <div className="container">
            <svg
            ref={svgRef}
            version="1.1"
            baseProfile="full"
            width="100%"
            height="100%"
            viewBox="0 0 480 360"
            id="svg_document" style={{zoom: 1}}
            visibility="visible">
                <title id="svg_document_title">Untitled.svg</title>
                <defs id="svg_document_defs"></defs>
                <g id="main_group" visibility="visible">
                    <rect id="background_rect" fill="#90ee90" x="0px" y="0px" width="480px" height="360px"></rect>
                    <path stroke="rgba(0,0,0,0.2)" id="path2" strokeWidth="3px" d="M2,192 C2,192 480,192 480,192 C480,192 0,192 0,192 "
                        fill="none"
                        transform=""
                        visibility="hidden"
                        ref={path2Ref}>
                    </path>
                </g>
                <path stroke="rgba(0,0,0,0.2)" 
                    id="path1"
                    strokeWidth="3px"
                    d="M0,115 C0,115 101,5 101,5 C101,5 217,241 217,241 C217,241 317,122 317,122 C317,122 480,359 480,359 "
                    fill="none"
                    transform=""
                    visibility="hidden"
                    ref={path1Ref}></path>
            </svg>
        </div>
    )
}

function getRandomPath(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default Scene;