d3.csv("path/to/your/UE_Ottawa_1 (1).csv").then(function (data) {
    // Determine the dimensions of the visualization
    const width = 960, height = 500;
    const svg = d3.select("#plot").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Function to convert spherical to Cartesian coordinates
    function sphericalToCartesian(r, theta, phi) {
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        return { x, y, z };
    }

    // Prepare the data
    const points = [];
    data.forEach((row, elevation) => {
        Object.entries(row).forEach(([azimuth, value], index) => {
            const r = parseFloat(value); // Assuming the value represents the radius
            const theta = (Math.PI / 180) * elevation; // Convert degrees to radians
            const phi = (Math.PI / 180) * index;
            const point = sphericalToCartesian(r, theta, phi);
            points.push(point);
        });
    });

    // Define scales to map Cartesian coordinates to the SVG canvas
    const xScale = d3.scaleLinear()
        .domain([d3.min(points, d => d.x), d3.max(points, d => d.x)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(points, d => d.y), d3.max(points, d => d.y)])
        .range([height, 0]);

    // Plot each point
    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 2)
        .style("fill", "blue");
});
