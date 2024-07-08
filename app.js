const base_url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const base_fallback_url = "https://latest.currency-api.pages.dev/v1/currencies";

let amount = document.querySelector("#amount");
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".btn")
const fromCurr = document.querySelector("#from");
const toCurr = document.querySelector("#to");
let msg = document.querySelector(".msg");

let errMsg = document.querySelector(".error-msg")

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option")
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected"
        }
        else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = "selected"
        }
        select.append(newOption)
    }
    select.addEventListener("change", (event) => {
        updateFlag(event.target)
    })
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let countryFlag = element.parentElement.querySelector(".countryFlag");
    countryFlag.src = newSrc;
}

btn.addEventListener("click", (e) => {
    e.preventDefault()
    getExchangeRate();
})

const getExchangeRate = async () => {
    let amountVal = amount.value;
    console.log(fromCurr.value);
    console.log(toCurr.value);

    if (amountVal < 1 || amountVal === "") {
        amount = 1;
        amountVal = 1;
        errMsg.innerText = "Number should be equal to or greater than 1"
        errMsg.style.color = "red"
    }

    const url = `${base_url}/${fromCurr.value.toLowerCase()}.json`;

    const fallbackUrl = `${base_fallback_url}/${fromCurr.value.toLowerCase()}.json`;

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch Exchange rate')
        console.log(response);
        let data = await response.json();
        console.log(data)

        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

        if (rate) {
            let finalAmount = amountVal * rate;
            msg.innerText = `${amountVal}${fromCurr.value} = ${finalAmount}${toCurr.value}`
        }

        else {
            throw new Error('Rate not found')
        }

    }

    catch (error) {
        console.error("Primary URL failed, trying fallback URL", error);

        try {
            let response = await fetch(fallbackUrl);
            if (!response.ok) throw new Error('Fallback URL failed');
            let data = await response.json();
            let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

            if (rate) {
                let finalAmount = amountVal * rate;
                msg.innerText = `${amountVal}${fromCurr.value} = ${finalAmount}${toCurr.value}`

            } else {
                throw new Error('Rate not found in fallback');
            }

        } catch (fallbackError) {
            console.error("Both primary and fallback URLs failed", fallbackError);
            errMsg.innerText = "Failed to fetch exchange rate. Please try again later.";
            errMsg.style.color = "red";
        }
    }

};

