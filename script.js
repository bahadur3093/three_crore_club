const result_wrapper = document.getElementById("result_wrapper");
const colors = [
  "#8452cc",
  "#383ce4",
  "#072a07",
  "#f96faa",
  "#263479",
  "#8aea12",
  "#dab1e7",
  "#c2d4a2",
  "#29b8e2",
  "#a36401",
  "#a59b13",
  "#41f996",
  "#ba27cc",
  "#078e9d",
  "#a031fd",
  "#0e7149",
  "#100613",
  "#9e8bd8",
  "#81cd4d",
  "#b19418",
  "#190d9e",
  "#33fa61",
  "#ed9480",
  "#6f9b2a",
  "#4e4e7d",
  "#ed54ba",
  "#cbf286",
  "#06a018",
  "#f36191",
  "#bd5a25",
  "#2b05dc",
  "#9de98b",
  "#02036b",
  "#c64779",
  "#c08a9b",
  "#4edcf0",
  "#2a3be7",
  "#36d268",
  "#12c328",
  "#3d03bd",
  "#8583c2",
  "#fdbef5",
  "#8133bd",
  "#3e62e6",
  "#6f510b",
  "#b03a91",
  "#c8f581",
  "#4e7152",
  "#5bb1b7",
  "#710ac8",
];

const captainColor = "#ffff00";
const viceCaptainColor = "#ffc0cb";

document.getElementById("csvFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    if(text) {
      const formattedTables = generateTeams(text).reduce((acc, player) => {
        const team = player.playerName;
        if (!acc[team]) acc[team] = [];
        acc[team].push(player);
        return acc;
      }, {});
  
      Object.entries(formattedTables).forEach(([player, teams]) => {
        const table = createStyledTable(player, teams, teams.length);
        result_wrapper.appendChild(table);
      });
  
      highlightDuplicateTeamRowsWithColors();
    } else {
      alert('Upload a csv');
    }
  };

  reader.readAsText(file);
});

function highlightDuplicateTeamRowsWithColors() {
  const rows = document.querySelectorAll(".team-row");
  const comboMap = new Map();
  let colorIndex = 0;

  rows.forEach((row) => {
    const teams = Array.from(row.children).map((cell) =>
      cell.textContent.trim()
    );
    const key = teams.slice().sort().join("|");

    if (!comboMap.has(key)) {
      comboMap.set(key, []);
    }
    comboMap.get(key).push(row);
  });

  for (const [_, rowGroup] of comboMap.entries()) {
    if (rowGroup.length > 1) {
      const color = colors[colorIndex % colors.length];
      rowGroup.forEach((row) => {
        row.style.backgroundColor = color;
      });
      colorIndex++;
    }
  }
}

function createStyledTable(playerName, playerTeams, rows) {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.marginBottom = "15px";

  const headerRow = document.createElement("tr");
  const th = document.createElement("th");
  th.textContent = playerName;
  th.style.border = "1px solid #000";
  th.style.padding = "8px";
  th.style.backgroundColor = "#019d3d";
  th.style.color = "#FFFFFF";
  th.colSpan = 11;
  th.style.textAlign = "left";
  headerRow.appendChild(th);
  table.appendChild(headerRow);

  for (let row = 0; row < rows; row++) {
    const tr = document.createElement("tr");
    tr.classList.add("team-row");
    playerTeams[row].teams.forEach((team) => {
      const td = document.createElement("td");
      td.textContent = `${team.name}`;
      td.style.border = "1px solid #ccc";
      td.style.padding = "8px";
      td.classList.add("team-cell");
      if (team.isCaptain) {
        td.style.backgroundColor = "#ffff00";
      } else if (team.isViceCaptain) {
        td.style.backgroundColor = "#ffc0cb";
      } else {
        td.style.backgroundColor = "";
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  }

  return table;
}

function generateTeams(text) {
  const teamByName = [];

  const rows = text.split("\n").map((row) => row.split(","));
  const allTeams = rows.slice(1);
  allTeams.forEach((team, idx) => {
    const playerName = team[0];
    const playingEleven = team.slice(1);
    teamByName.push({
      playerName,
      teams: [],
    });
    playingEleven.forEach((player) => {
      const isCaptain = player.includes("(C)");
      const isViceCaptain = player.includes("(VC)");
      const name = player.replace(/\(C\)|\(VC\)|\r/g, "").trim();
      const playerData = {
        name,
        isCaptain,
        isViceCaptain,
      };
      teamByName[idx].teams.push(playerData);
    });
  });
  return teamByName;
}

// Set Legends colod
document.getElementById('captainColor').style.backgroundColor = captainColor;
document.getElementById('viceCaptainColor').style.backgroundColor = viceCaptainColor;
