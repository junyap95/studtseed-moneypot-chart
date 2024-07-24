// Load Chart.js library
var imported = document.createElement('script');
imported.src = "https://cdn.jsdelivr.net/npm/chart.js";
document.head.appendChild(imported);

// Wait for the library to load before executing the chart-related code
imported.onload = function() {
    const { totalPot, allocatedPot, imagePot } = data.config;
    const remaining = totalPot - allocatedPot;
    const imageURL = imagePot;
    
    const remainingText = document.querySelector(".remainingPot");
    remainingText.textContent += " " + remaining;
    
    // Function to get or create the tooltip element
    const getOrCreateTooltip = (chart) => {
      let tooltipEl = chart.canvas.parentNode.querySelector('.chartjs-tooltip');
    
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'chartjs-tooltip';
        const table = document.createElement('table');
        table.style.margin = '0px';
        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
      }
    
      return tooltipEl;
    };
    
    const externalTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(b => b.lines);

    const tableHead = document.createElement('thead');
    tableHead.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';

    titleLines.forEach(title => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = 0;

      const th = document.createElement('th');
      th.style.borderWidth = 0;
      th.style.color = '#fff';
      th.style.fontWeight = 'bold';
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.marginRight = '10px';
      span.style.height = '10px';
      span.style.width = '10px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = 0;

      const td = document.createElement('td');
      td.style.borderWidth = 0;
      td.style.color = '#fff';

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  // Get the canvas position and size
  const { offsetLeft: canvasLeft, offsetTop: canvasTop, width, height } = chart.canvas;
  const chartCenterX = canvasLeft + width / 2;

  // Calculate tooltip position based on cursor and chart center
  const tooltipX = tooltip.caretX + canvasLeft;
  const tooltipY = tooltip.caretY + canvasTop;

  // Position the tooltip based on cursor's horizontal position
  let tooltipLeft = tooltipX;
  let tooltipTop = tooltipY;

  // Check if the cursor is on the left or right side of the chart
  if (tooltipX < chartCenterX) {
    // Cursor is on the left half of the chart
    tooltipLeft = tooltipX - tooltipEl.offsetWidth - 10; // Adjust the offset as needed
  } else {
    // Cursor is on the right half of the chart
    tooltipLeft = tooltipX + 10; // Adjust the offset as needed
  }

  // Ensure tooltip doesn't go out of bounds horizontally
  tooltipLeft = Math.max(canvasLeft, Math.min(tooltipLeft, canvasLeft + width - tooltipEl.offsetWidth));

  // Apply calculated positions
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = `${tooltipLeft}px`;
  tooltipEl.style.top = `${tooltipTop}px`;
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`;
};

    // Display chart
    $('#chart').empty();
    $('#chart').append('<div id="imagePot"></div><canvas id="myChart" width="300" height="300"></canvas>');
    
    document.getElementById('imagePot').innerHTML = '<img src="' + imageURL + '" alt="Moneypot Image" class="image-pot">';
    
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Funds Remaining", "Funds Allocated"],
            datasets: [{
                data: [remaining, allocatedPot],
                backgroundColor: ['#f58439', '#d7d9e3'],
                hoverOffset: 5,
                borderWidth: 25
            }]
        },
        options: {
            responsive: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                  enabled: false,
                  position: 'nearest',
                  external: externalTooltipHandler
                }
            }
    
        }
    });
};
