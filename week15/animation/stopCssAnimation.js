function stop() {
    let el = document.getElementById('el');
    let position = getComputedStyle(el).transform;
    let position2 = el.getBoundingClientRect();

    el.style.transform = position;
    // el.style.transform = `translate(${position2.x}px, ${position2.y}px)`
    console.log(position);
    console.log(position2)
}

