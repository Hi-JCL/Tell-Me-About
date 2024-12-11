const countryName = document.getElementById("country-name");
const searchBtn = document.getElementById("search-btn");
const areaVal = document.getElementById("area-val");
const flag = document.getElementById("flag");
const countryCardBox = document.getElementById("country-card-box");
const generalInfos = document.querySelectorAll(".data");
const cardValues = document.querySelectorAll(".card-value");
const tooltip = document.getElementById("tooltip");
const countryInput = document.getElementById("country-input");

// methods

const checkBlankInput = function (name) {
  const regex = /^\s*$/;
  let flag = 0;
  if (regex.test(name)) {
    flag++;
  }
  return flag;
};

// it set the general information of the country
const setGeneralInformation = function (data) {
  const currencyKey = Object.keys(data.currencies);
  countryName.innerText = data.name.common;
  generalInfos[0].innerText = data.capital[0];
  generalInfos[1].innerText = data.currencies[currencyKey].symbol;
  generalInfos[2].innerText = data.currencies[currencyKey].name;
  generalInfos[3].innerText = Object.values(data.languages);

  flag.src = data.flags.svg;
  flag.alt = data.flags.alt;
};

// it set related information about country
const setRelatedInfo = function (data) {
  cardValues[0].innerHTML =
    (Number.parseInt(data.population) / 1000000).toFixed(2) + "<br/>Million";
  cardValues[1].innerText =
    (Number.parseInt(data.area) / 1000).toFixed(2) + " K";
  cardValues[2].innerText = data.continents[0];
  cardValues[3].innerText = data.unMember == true ? "Yes" : "No";
  cardValues[4].innerText = data.independent == true ? "Yes" : "No";
};

// it create neighboring country card and insert to html
const neighborCard = function (
  countryName = "",
  continent = "",
  flagURL = "",
  population = "",
  currencySymbol = "",
  language = ""
) {
  const card = `<div class="country-card">
              <div class="neighbor-flag">
                <img src="${flagURL}" alt="" />
              </div>
              <div class="neighbor-info">
                <p class="neighbor-name">${countryName}</p>
                <p class="neighbor-cont">${continent}</p>
                <div class="neighbor-details">
                  <div class="detail-row">
                    <img src="./assets/team.png" alt="" class="detail-key" />
                    <p class="neighbor-value">${population} M</p>
                  </div>
                  <div class="detail-row">
                    <img src="./assets/coin.png" alt="" class="detail-key" />
                    <p class="neighbor-value">${currencySymbol}</p>
                  </div>
                  <div class="detail-row">
                    <img src="./assets/speak.png" alt="" class="detail-key" />
                    <p class="neighbor-value">${language}</p>
                  </div>
                </div>
              </div>
            </div>`;

  countryCardBox.insertAdjacentHTML("beforeend", card);
};

// it fetch all neighboring country details
const getNeighborDetail = function (code) {
  fetch(`https://restcountries.com/v3.1/alpha/${code}`)
    .then((res) => res.json())
    .then((data) => {
      const key = Object.keys(data[0].currencies);
      const lan = Object.keys(data[0].languages);

      neighborCard(
        data[0].name.common,
        data[0].continents[0],
        data[0].flags.svg,
        (Number(data[0].population) / 1000000).toFixed(2),
        data[0].currencies[key[0]].symbol,
        data[0].languages[lan[0]]
      );
    });
};

// it check how many neighbor country and send country code to fetch data
const setNeighborCountry = function (data) {
  if (data.borders.length > 0) {
    countryCardBox.innerText = "";
    data.borders.forEach((el) => {
      getNeighborDetail(el);
    });
  }
};

// it take country name and fetch data
const getCountryDetail = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((res) => res.json())
    .then((data) => {
      setGeneralInformation(data[0]);
      setRelatedInfo(data[0]);
      setNeighborCountry(data[0]);
      const generalInfo = document.getElementById("general-info");
      const rib = document.getElementById("related-info-box");
      const neighbor = document.getElementById("neighbor");
      generalInfo.classList.remove("hide");
      generalInfo.style.opacity = 1;
      rib.classList.remove("hide");
      rib.style.opacity = 1;
      neighbor.classList.remove("hide");
      neighbor.style.opacity = 1;
    });
};

// on button click it take country name from input and call getCountryDetail
searchBtn.addEventListener("click", function () {
  const isInputEmpty = checkBlankInput(countryInput.value);
  if (isInputEmpty === 1) {
    tooltip.style.opacity = 1;
    return;
  }
  getCountryDetail(countryInput.value);
});

// on input focus, it hide tooltip
countryInput.addEventListener("focus", function () {
  tooltip.style.opacity = 0;
});

// when click on any neighbor country card
// it fetch name from card and insert into input field
// and call getCountryDetail to fetch country data
countryCardBox.addEventListener("click", function (e) {
  const cname = e.target
    .closest(".country-card")
    .getElementsByClassName("neighbor-name")[0].innerText;

  if (cname) {
    window.scrollTo(0, 0);
    countryInput.value = cname;
    getCountryDetail(cname);
  }
});
