const get = id => document.getElementById(id);
const SVG_NS = "http://www.w3.org/2000/svg";

function addControllableLine(start, end){
    let enabled = true;
    /**
     * @param {HTMLElement} element 
     */
    const registerDragAction = (element, action) => {
        const pos1 = {
            x: 0,
            y: 0
        };
        const pos2 = {
            x: 0,
            y: 0
        };
        element.addEventListener('mousedown', e => {
            if(!enabled) return;
            pos1.x = e.clientX;
            pos1.y = e.clientY;
            document.onmousemove = e => {
                pos2.x = pos1.x - e.clientX;
                pos2.y = pos1.y - e.clientY;
                pos1.x = e.clientX;
                pos1.y = e.clientY;

                const x =  element.offsetLeft - pos2.x;
                const y =  element.offsetTop - pos2.y;
                element.style.left = x + 'px';
                element.style.top = y + 'px';
                action(x, y)
            };
            document.onmouseup = e => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        })
    };
    const editPathData = (pathData, index, data) => {
        let res = pathData.split(' ');
        let indexCounter = 0;
        for(const v of data){
            res[index[indexCounter]] = v;
            indexCounter++;
        }
        return res.join(' ');
    }
    const getPoint = (p1, p2, multiplier) => {
        return {
            x: p1[0] + (p2[0] - p1[0]) * multiplier,
            y: p1[1] + (p2[1] - p1[1]) * multiplier
        };
    };
    const points = [];
    const createControlPoint = (x, y, newPathDataFunction) => {
        const point = document.createElement('div');
        point.className = 'controlPoint';
        registerDragAction(point, (x, y) => {
            const pathData = path.getAttribute('d');
            path.setAttribute('d', newPathDataFunction(pathData, x, y))
        })
        point.style.left = x + 'px';
        point.style.top = y + 'px';
        points.push(point)
        document.body.appendChild(point)
    };
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('stroke', 'black')
    path.setAttribute('fill', 'transparent')
    path.setAttribute('d', `M ${start[0]} ${start[1]} Q ${getPoint(start, end, 0.3).x} ${getPoint(start, end, 0.3).y} ${getPoint(start, end, 0.6).x} ${getPoint(start, end, 0.6).y} Q ${getPoint(start, end, 0.6).x} ${getPoint(start, end, 0.6).y} ${end[0]} ${end[1]}`)
    get('svg').appendChild(path) // override this


    createControlPoint(start[0], start[1], (d, x, y) => {
        return editPathData(d, [1, 2], [null, x , y])
    })
    createControlPoint(getPoint(start, end, 0.3).x, getPoint(start, end, 0.3).y, (d, x, y) => {
        return editPathData(d, [4, 5], [x, y])
    })
    createControlPoint(getPoint(start, end, 0.6).x, getPoint(start, end, 0.6).y, (d, x, y) => {
        return editPathData(d, [6, 7], [x, y])
    })
    createControlPoint(getPoint(start, end, 0.6).x, getPoint(start, end, 0.6).y, (d, x, y) => {
        return editPathData(d, [9, 10], [x, y])
    })
    createControlPoint(end[0], end[1], (d, x, y) => {
        return editPathData(d, [11, 12], [x, y])
    })
    const enablePoints = () => {
        for(const p of points) p.style.display = 'block';
        enabled = true;
    };
    const disablePoints = () => {
        for(const p of points) p.style.display = 'none';
        enabled = false;
    };
    path.addEventListener('click', e => {
        enablePoints()
    })
    document.addEventListener('click', e => {
        if(!path.contains(e.target) && points.every(p => !p.contains(e.target))) disablePoints()
    })
}

addControllableLine([100, 100], [300, 300])