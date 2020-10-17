const targetCounty = args.widgetParameter || 41051 //fips code of desired county, list here: https://www.nrcs.usda.gov/wps/portal/nrcs/detail/national/home/?cid=nrcs143_013697

const url = "https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_confirmed_usafacts.csv"
const request = new Request(url)
const contents = await request.loadString()
const lines = contents.split("\n")
const county = findCounty(targetCounty, lines).split(",");
if (county) {
  const widget = new ListWidget()
  const header = widget.addText(county[1])
  header.font = Font.boldSystemFont(18)
  widget.addSpacer(16)
  const caseCount = parseInt(county[county.length -1])
  const cases = widget.addText(`${caseCount} cases`)
  cases.font = Font.systemFont(16)
  const delta = county[county.length -1] - county[county.length - 2]
  const deltaText = widget.addText(`${delta > 0 ? '+' : ''}${delta} new cases`)
  deltaText.font = Font.systemFont(14)
  if (delta === 0 && caseCount === 0) {
    deltaText.textColor = Color.green()
  } else if (delta === 0) {
    deltaText.textColor = Color.yellow()
  } else if (delta > 0) {
    deltaText.textColor = Color.red()
  } else {
    deltaText.textColor = Color.green()
  }
  
  if (config.runsInWidget) {
    Script.setWidget(widget)
  } else {
    widget.presentSmall()
  }
}
Script.complete()

function findCounty(fips, data) {
  if (data.length === 1) {
    const values = data[0].split(",")
    if (values[0] == fips) {
      return data[0]
    }
    return undefined
  }
  const midpoint = Math.floor(data.length / 2)
  const values = data[midpoint].split(",")
  if (values[0] == fips) {
    return data[midpoint]
  }
  if (values[0] > fips) {
    return findCounty(fips, data.splice(0, midpoint))
  } else {
    return findCounty(fips, data.splice(midpoint, data.length - midpoint + 1))
  }
}
