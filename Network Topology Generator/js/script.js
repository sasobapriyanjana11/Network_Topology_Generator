let nodes = [];
let links = [];
let svg, width, height, maxNodes, nodeElements, linkElements, selectedNode = null;

// Initialization
function init() {
    [width, height, maxNodes] = getOfficeDimensions('medium');
    generateNetwork();
}

// Form submission handler
document.getElementById('topologyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const numNodes = parseInt(document.getElementById('numNodes').value, 10);
    const officeSize = document.getElementById('officeSize').value;

    [width, height, maxNodes] = getOfficeDimensions(officeSize);
    if (numNodes > maxNodes) {
        alert(`Warning: The number of nodes exceeds the maximum allowed for the selected office size (${maxNodes} nodes).`);
        const suggestedSize = suggestOfficeSize(numNodes);
        alert(`Consider choosing a "${suggestedSize}" office size for ${numNodes} nodes.`);
        return;
    }

    nodes = Array.from({ length: numNodes }, (_, i) => ({
        id: `Node${i + 1}`,
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
        isNew: false
    }));

    links = suggestTopology(numNodes);
    generateNetwork();
    updateIPRanges(numNodes);

    const suggestedSecurity = suggestSecurityRequirements(numNodes, officeSize);
    displaySecuritySuggestions(suggestedSecurity);
});

// Generate network visualization
function generateNetwork() {
    if (svg) svg.remove();

    svg = d3.select("#networkContainer").append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", function(event) {
            if (nodes.length >= maxNodes) {
                alert(`Warning: The maximum number of nodes (${maxNodes}) for this office size has been reached.`);
                return;
            }

            const [x, y] = d3.pointer(event);
            if (selectedNode) {
                const newNode = {
                    id: `Node${nodes.length + 1}`,
                    x: x,
                    y: y,
                    isNew: true
                };
                nodes.push(newNode);
                links = suggestTopology(nodes.length); // Update links based on new node count
                updateLinksAndNodes();
                updateNodeCountInput();
                updateIPRanges(nodes.length); // Update IP ranges on new node addition
                selectedNode = null;
            } else {
                selectedNode = nodes.find(node => Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2) < 10);
            }
        })
        .on("contextmenu", function(event) {
            event.preventDefault();
            const [x, y] = d3.pointer(event);
            removeNodeAt(x, y);
        });

    updateLinksAndNodes();
    updateTopologyName(); // Update topology name after generating the network
}


// Update the links and nodes in the network
function updateLinksAndNodes() {
    linkElements = svg.selectAll(".link")
        .data(links, d => `${d.source}-${d.target}`)  // Key function to bind data
        .join(
            enter => enter.append("line")
                .attr("class", "link")
                .attr("stroke", "#999")
                .attr("stroke-width", "2px"),
            update => update,
            exit => exit.remove()
        );

    linkElements
        .attr("x1", d => nodes.find(node => node.id === d.source).x)
        .attr("y1", d => nodes.find(node => node.id === d.source).y)
        .attr("x2", d => nodes.find(node => node.id === d.target).x)
        .attr("y2", d => nodes.find(node => node.id === d.target).y);

    nodeElements = svg.selectAll(".node")
        .data(nodes, d => d.id)  // Key function to bind data
        .join(
            enter => enter.append("circle")
                .attr("class", "node")
                .attr("r", 10)
                .attr("fill", d => d.isNew ? "green" : "#1f77b4")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)),
            update => update
                .attr("fill", d => d.isNew ? "green" : "#1f77b4")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y),
            exit => exit.remove()
        );

    svg.selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x + 15)
        .attr("y", d => d.y + 5)
        .text(d => d.id)
        .style("font-size", "15px")
        .style("fill", "#333");

    function dragstarted(event, d) {
        d3.select(this).raise().classed("active", true);
    }

    function dragged(event, d) {
        d.x = Math.max(10, Math.min(width - 10, event.x));
        d.y = Math.max(10, Math.min(height - 10, event.y));
        d3.select(this).attr("cx", d.x).attr("cy", d.y);
        updateLinksAndNodes();
    }

    function dragended(event, d) {
        d3.select(this).classed("active", false);
    }
}

// Add node at a specific position
function addNodeAt(x, y) {
    if (nodes.length >= maxNodes) {
        alert('Cannot add more nodes. Maximum limit reached.');
        return;
    }
    const newNode = {
        id: `Node${nodes.length + 1}`,
        x: x,
        y: y,
        isNew: true
    };
    nodes.push(newNode);
    links = suggestTopology(nodes.length);
    generateNetwork();
    updateNodeCountInput();
    updateIPRanges(nodes.length);
}

// Remove node at a specific position
function removeNodeAt(x, y) {
    const threshold = 15;
    const nodeToRemove = nodes.find(node => Math.abs(node.x - x) < threshold && Math.abs(node.y - y) < threshold);
    if (nodeToRemove) {
        nodes = nodes.filter(node => node.id !== nodeToRemove.id);
        links = links.filter(link => link.source !== nodeToRemove.id && link.target !== nodeToRemove.id);
        generateNetwork();
        updateNodeCountInput();
        updateIPRanges(nodes.length);
    }
}

// Update the number of nodes in the input field
function updateNodeCountInput() {
    document.getElementById('numNodes').value = nodes.length;
}


// Get office dimensions based on office size
function getOfficeDimensions(officeSize) {
    let dimensions;
    switch (officeSize) {
        case 'small':
            dimensions = [400, 400, 10];
            break;
        case 'medium':
            dimensions = [600, 600, 20];
            break;
        case 'large':
            dimensions = [800, 800, 30];
            break;
        default:
            dimensions = [600, 600, 20];
    }
    return dimensions;
}

// Suggest office size based on number of nodes
function suggestOfficeSize(numNodes) {
    if (numNodes <= 10) {
        return 'small';
    } else if (numNodes <= 20) {
        return 'medium';
    } else {
        return 'large';
    }
}

// Suggest network topology based on number of nodes
function suggestTopology(numNodes) {
    let links = [];
    for (let i = 0; i < numNodes - 1; i++) {
        links.push({ source: `Node${i + 1}`, target: `Node${i + 2}` });
    }
    return links;
}

// Update IP ranges
function updateIPRanges(numNodes) {
    const ipRanges = [];
    for (let i = 1; i <= numNodes; i++) {
        ipRanges.push(`192.168.0.${i}`);
    }
    document.getElementById('ipRanges').innerText = `IP Ranges: ${ipRanges.join(', ')}`;
}

// Suggest security requirements based on number of nodes and office size
function suggestSecurityRequirements(numNodes, officeSize) {
    let requirements = [];
    if (numNodes <= 10 && officeSize === 'small') {
        requirements = ['firewall', 'vpn'];
    } else if (numNodes <= 20 && officeSize === 'medium') {
        requirements = ['firewall', 'encryption', 'vpn'];
    } else if (numNodes > 20 && officeSize === 'large') {
        requirements = ['firewall', 'encryption', 'vpn', 'ids'];
    }
    return requirements;
}

// Display suggested security requirements
function displaySecuritySuggestions(requirements) {
    const container = document.getElementById('securitySuggestions');
    if (container) container.remove();

    const suggestionContainer = document.createElement('div');
    suggestionContainer.id = 'securitySuggestions';
    suggestionContainer.className = 'mt-4';
    suggestionContainer.innerHTML = `
        <h5>Suggested Security Requirements</h5>
        <ul class="list-group">
            ${requirements.map(req => `<li class="list-group-item">${req.charAt(0).toUpperCase() + req.slice(1)}</li>`).join('')}
        </ul>
    `;
    document.getElementById('content').appendChild(suggestionContainer);
}

// Update topology name
function updateTopologyName() {
    let topologyType;
    if (nodes.length <= 4) {
        topologyType = "Star Topology";
    } else if (nodes.length <= 10) {
        topologyType = "Ring Topology";
    } else {
        topologyType = "Mesh Topology";
    }
    document.getElementById('topologyName').innerHTML = `<h3>Topology Type:</h3><p>${topologyType}</p>`;
    // const topologyName = `Generated Topology (${nodes.length} nodes)`;
    // document.getElementById('topologyName').innerText = topologyName;
}

// Event listeners for buttons
document.getElementById('exportBtn').addEventListener('click', function() {
    exportAsPNG();
});

document.getElementById('simulateBtn').addEventListener('click', function() {
    simulateDataTransfer();
});

document.getElementById('helpBtn').addEventListener('click', function() {
    openHelpDocumentation();
});

// Function to export the network topology as a PNG
function exportAsPNG() {
    html2canvas(document.querySelector("#networkContainer")).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'network_topology.png';
        link.click();
    });
}

// Function to simulate data transfer between nodes
function simulateDataTransfer() {
    if (nodes.length === 0) return;

    const path = [];
    for (let i = 0; i < nodes.length; i++) {
        path.push(nodes[i].id);
    }
    alert(`Simulating data transfer through nodes: ${path.join(' -> ')}`);
}

// Function to open help documentation in a new window
function openHelpDocumentation() {
    window.open('/pages/help.html', '_blank');
}

// Initialize network
init();
