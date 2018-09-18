const API_KEY = "6f433300-bafc-11e8-88c5-811c39b2c016";
let hashid = location.hash.substring(1);

document.addEventListener("DOMContentLoaded", () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  if (hashid == "") { 
    showGalleries(url);
  } else {
    showObjectsTable(hashid);
  }

  document.getElementById("bbutton").onclick = function () {
      location.href = "index.html";
  };
  
});

function showGalleries(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(gallery => {
      document.querySelector("#galleries").innerHTML += `
        <td>
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </td>
      `;
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

function showObjectsTable(id) {
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#objectpage").style.display = "none";

  objsUrl = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&size=99&gallery=${id}`;
  document.querySelector("#objects").innerHTML = `
    <tr>
      <th>Title</th>
      <th>Image</th>
      <th>People</th>
      <th>URL</th>
    </tr>
  `;

  fetch(objsUrl)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(object => {
      ppl = "None Listed";
      if (object.people) {
        for (var i = 0; i < object.people.length; i++) {
          if (i > 0) {
            ppl = ppl + ", " + object.people[i].name;
          } else {
            ppl = object.people[i].name;
          }
        }
      }

      document.querySelector("#objects").innerHTML += `
        <tr>
          <td><a onclick="showObjectInfo('${object.objectnumber}', ${id})">${object.title}</td>
          <td><img src='${object.primaryimageurl}'></td>
          <td>${ppl}</td>
          <td><a href='${object.url}'>See More</a></td>
        </tr>
      `;
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

function showObjectInfo(objNum, galleryId) {
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#objectpage").style.display = "block";

  objUrl = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${objNum}`;
  document.querySelector("#objectpage").innerHTML = ``;
  
  fetch(objUrl)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(object => {
      
      document.querySelector("#objectpage").innerHTML += `
        <h2>${object.title}</h2>
        <button onclick='showObjectsTable(${galleryId})'>Back</button>
        <br>
        <img src='${object.primaryimageurl}'>
        <div id="single-object">
            
        </div>
      `;

      document.querySelector("#single-object").innerHTML += `
        <p>
          Description: ${object.description}
        </p>
        <p>
          Provenance: ${object.provenance}
        </p>
        <p>
          Accession Year: ${object.accessionyear}
        </p>
      `;
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}
