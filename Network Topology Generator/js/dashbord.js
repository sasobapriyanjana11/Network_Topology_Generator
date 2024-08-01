document.addEventListener('DOMContentLoaded', (event) => {
    // Node Distribution Chart
    var ctx = document.getElementById('nodeDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Node1', 'Node2', 'Node3'],
            datasets: [{
                label: '# of Nodes',
                data: [12, 19, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // Topology Type Usage Chart
    var ctx2 = document.getElementById('topologyTypeUsageChart').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Ring', 'Star', 'Mesh'],
            datasets: [{
                label: '# of Topologies',
                data: [12, 19, 3],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // Response Time Chart
    var ctx3 = document.getElementById('responseTimeChart').getContext('2d');
    new Chart(ctx3, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Response Time (ms)',
                data: [65, 59, 80, 81, 56],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        }
    });

    // Security Requirements Chart
    var ctx4 = document.getElementById('securityRequirementsChart').getContext('2d');
    new Chart(ctx4, {
        type: 'pie',
        data: {
            labels: ['Encryption', 'Firewall', 'IDS', 'VPN'],
            datasets: [{
                label: 'Security Requirements',
                data: [10, 20, 30, 40],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // Network Load Chart
    var ctx5 = document.getElementById('networkLoadChart').getContext('2d');
    new Chart(ctx5, {
        type: 'bar',
        data: {
            labels: ['Node1', 'Node2', 'Node3', 'Node4', 'Node5'],
            datasets: [{
                label: 'Network Load',
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // Risk Assessment Chart
    var ctx6 = document.getElementById('riskAssessmentChart').getContext('2d');
    new Chart(ctx6, {
        type: 'pie',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                label: 'Risk Assessment',
                data: [10, 20, 70],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
});
