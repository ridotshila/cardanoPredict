import {
  Lucid,
  Blockfrost,
  Constr,
  Data,
} from "https://unpkg.com/lucid-cardano@0.10.11/web/mod.js";

// =====================================================
// DATUM & REDEEMER SCHEMAS
// =====================================================

const PricePredictionDatum = Data.Object({
  ppPredictor: Data.Bytes(),
  ppTargetEpoch: Data.Integer(),
  ppPredictedPrice: Data.Integer(),
  ppStake: Data.Integer(),
  ppOracle: Data.Bytes(),
  ppResolved: Data.Boolean(),
});

const RedeemerSchema = Data.Enum([
  Data.Literal("SubmitPrediction"),
  Data.Literal("ResolvePrediction"),
  Data.Literal("ClaimReward"),
]);

// =====================================================
// CONFIGURATION
// =====================================================

const CONFIG = {
  BLOCKFROST_URL: "https://cardano-preprod.blockfrost.io/api/v0",
  BLOCKFROST_KEY: "preprodYjRkHfcazNkL0xxG9C2RdUbUoTrG7wip",
  NETWORK: "Preprod",
  MIN_STAKE: 10_000_000n, // 10 ADA in lovelace
  SCRIPT_CBOR: "590c5f010000323232323233223232323232323232332232323322323232323232323232323232332232323223232323232322322323253353232325333500215335533535003222222001103013357389211770726564696374696f6e206e6f74207265736f6c7665640002f15335333573466e20ccc040ccd54c0484800488cd54c05c480048d400488cd540a0008cd54c068480048d400488cd540ac008ccd40048cc0f52000001223303e00200123303d00148000004cd54c05c480048d400488cd540a0008ccd40048cd54c06c480048d400488cd540b0008d5407400400488ccd5540600740080048cd54c06c480048d400488cd540b0008d54070004004ccd55404c0600080054088c8c8d4004888888888888ccd54c0804800488d40088888d401088cd400894cd4ccd5cd19b8f017001047046133503800600810082008503000a35002220023500322222200601b01b3500322222200302f0301030133573892010f726577617264206e6f7420706169640002f102f1533533017350012200235003222222002103013357389201186f7261636c65207369676e6174757265206d697373696e670002f153355335330173500122002350032222220061030133573892011b707265646963746f72207369676e6174757265206d697373696e670002f1533553353500122350022222222222223333500d25034250342503423335530271200150282350012253355335333573466e3cd400888008d4010880081081044ccd5cd19b873500222001350042200104204110411350380031503700d21333573466e20ccc044d4d400488004888800c070070d401088888800c0c00c44c98c80c8cd5ce24811473637269707420696e707574206d697373696e6700033103013357389201107374616b65206e6f74206c6f636b65640002f102f3333573466e1cd55cea80224000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd40a80acd5d0a80619a8150159aba1500b33502a02c35742a014666aa05ceb940b4d5d0a804999aa8173ae502d35742a01066a0540706ae85401cccd540b80e5d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd410dd69aba150023044357426ae8940088c98c8120cd5ce02402482309aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a821bad35742a00460886ae84d5d1280111931902419ab9c048049046135573ca00226ea8004d5d09aba2500223263204433573808808a08426aae7940044dd50009aba1500533502a75c6ae854010ccd540b80d48004d5d0a801999aa8173ae200135742a004606e6ae84d5d1280111931902019ab9c04004103e135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a008604e6ae84d5d1280211931901919ab9c0320330303333573466e1d401520042122200323333573466e1d401920022122200223333573466e1d401d20002122200123263203333573806606806206005e6666ae68cdc39aab9d500b480008cccccc88888848cccccc00401c01801401000c008dd71aba1500b375a6ae854028dd69aba15009375a6ae854020dd71aba15007302c357426ae89401c8c98c80c0cd5ce01801881708180b09aab9e50011375400226aae74dd500089aba25001135744a00226ae8940044d55cf280089baa0012446464600200a640026aa0524466a0029000111a80111299a999ab9a3371e0040120540522600e0022600c006640026aa0504466a0029000111a80111299a999ab9a3371e00400e05205020022600c006222444666aa600824002a02666aa600e2400246a0024466aa0300046aa012002666aa600824002446a00444a66a666aa601c240026466a02244666a006440040040026a00244002246600244a66a0042052200204c46a002446601400400a00c2006266a02e008006a02800266aa600e2400246a002446466aa032006600200a640026aa05444a66a00226aa0140064426a00444a66a6601800401022444660040140082600c006004640026aa0464422444a66a00220044426600a004666aa600e2400200a0080022242444600600822424446002008640026aa040442244a66a0022a02244266a024600800466aa600c2400200800244666ae68cdc780100080e00d911a801111111111111299a999aa980789000a8081299a999ab9a3371e01c00205004e26a03c0022a03a00842050204c640026aa03a4422444a66a00226a00644002442666a00a440046008004666aa600e2400200a008002266a00244a66a004420062002a01824424660020060049101001232230023758002640026aa034446666aae7c004940288cd4024c010d5d080118019aba200201a232323333573466e1cd55cea80124000466442466002006004601e6ae854008c014d5d09aba2500223263201933573803203402e26aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea8012400046644246600200600460306ae854008cd404005cd5d09aba2500223263201e33573803c03e03826aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931901019ab9c02002101e01d01c135573aa00226ea8004d5d0a80119a8063ae357426ae8940088c98c8068cd5ce00d00d80c09aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d5405c88c8cccd55cf80112804119a80399aa80498031aab9d5002300535573ca00460086ae8800c0604d5d08008891001091091198008020018891091980080180109119191999ab9a3370ea002900011a80398029aba135573ca00646666ae68cdc3a801240044a00e464c6402866ae700500540480444d55cea80089baa0011212230020031122001232323333573466e1d400520062321222230040053007357426aae79400c8cccd5cd19b875002480108c848888c008014c024d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6402466ae7004804c04003c0380344d55cea80089baa001232323333573466e1cd55cea80124000466442466002006004600a6ae854008dd69aba135744a004464c6401c66ae7003803c0304d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e500223263200c33573801801a01426ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263201533573802a02c02602402202001e01c01a26aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931900719ab9c00e00f00c00b135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c802ccd5ce00580600480409aab9d50011375400224464646666ae68cdc3a800a40084244400246666ae68cdc3a8012400446424446006008600c6ae84d55cf280211999ab9a3370ea00690001091100111931900619ab9c00c00d00a009008135573aa00226ea80048c8cccd5cd19b8750014800880148cccd5cd19b8750024800080148c98c8020cd5ce00400480300289aab9d3754002244004244002932490350543100120012233700004002224646002002446600660040040021"
};

// =====================================================
// GLOBAL STATE
// =====================================================

let lucid = null;
let walletAddress = null;
let scriptAddress = null;
let script = null;
let currentEpoch = null;
let currentPrice = null;

// =====================================================
// INITIALIZATION
// =====================================================

async function init() {
  try {
    log("Initializing dApp...", "info");
    
    // Check if Lace wallet is available
    if (!window.cardano || !window.cardano.lace) {
      log("⚠️ Lace wallet not found. Please install it first.", "error");
      alert("Please install Lace wallet extension to use this dApp.");
      return;
    }

    // Initialize Lucid
    lucid = await Lucid.new(
      new Blockfrost(CONFIG.BLOCKFROST_URL, CONFIG.BLOCKFROST_KEY),
      CONFIG.NETWORK
    );

    // Connect wallet
    const api = await window.cardano.lace.enable();
    lucid.selectWallet(api);
    
    walletAddress = await lucid.wallet.address();
    
    // Initialize script
    script = {
      type: "PlutusV2",
      script: CONFIG.SCRIPT_CBOR,
    };
    
    scriptAddress = lucid.utils.validatorToAddress(script);
    
    // Update UI
    document.getElementById("walletInfo").innerHTML = 
      `<span class="status-indicator status-connected"></span>
       Connected: ${walletAddress.substring(0, 20)}...`;
    document.getElementById("walletInfo").style.display = "block";
    
    // Fetch current data
    await fetchCurrentData();
    
    log("✅ Wallet connected successfully!", "success");
    log(`Script address: ${scriptAddress.substring(0, 30)}...`, "info");
    
  } catch (error) {
    log(`❌ Initialization failed: ${error.message}`, "error");
    console.error(error);
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

async function fetchCurrentData() {
  try {
    log("Fetching current epoch and price...", "info");
    
    // Fetch current epoch from Blockfrost
    const epochResponse = await fetch(
      `${CONFIG.BLOCKFROST_URL}/epochs/latest`,
      {
        headers: { 'project_id': CONFIG.BLOCKFROST_KEY }
      }
    );
    
    if (epochResponse.ok) {
      const epochData = await epochResponse.json();
      currentEpoch = epochData.epoch;
      document.getElementById("epoch").value = currentEpoch + 2; // Suggest 2 epochs ahead
      log(`📅 Current epoch: ${currentEpoch}`, "info");
    }
    
    // Fetch current ADA price (simulated - in production use oracle)
    // For demo, we'll use a random price around 0.45 ADA
    currentPrice = 450000n + BigInt(Math.floor(Math.random() * 10000));
    document.getElementById("price").value = currentPrice.toString();
    log(`💰 Current ADA price: ~${(Number(currentPrice) / 1000000).toFixed(3)} ADA`, "info");
    
  } catch (error) {
    log(`⚠️ Could not fetch current data: ${error.message}`, "error");
  }
}

function log(message, type = "info") {
  const logElement = document.getElementById("log");
  const timestamp = new Date().toLocaleTimeString();
  
  let colorClass = "";
  switch(type) {
    case "success": colorClass = "log-success"; break;
    case "error": colorClass = "log-error"; break;
    case "info": colorClass = "log-info"; break;
  }
  
  const logEntry = document.createElement("div");
  logEntry.className = "log-entry";
  logEntry.innerHTML = `
    <div class="log-timestamp">[${timestamp}]</div>
    <div class="log-message ${colorClass}">${message}</div>
  `;
  
  logElement.prepend(logEntry);
  
  // Keep only last 20 entries
  const entries = logElement.querySelectorAll('.log-entry');
  if (entries.length > 20) {
    entries[entries.length - 1].remove();
  }
}

function showLoading(buttonId) {
  const button = document.getElementById(buttonId);
  const originalText = button.innerHTML;
  button.innerHTML = `<span class="spinner"></span> Processing...`;
  button.disabled = true;
  return () => {
    button.innerHTML = originalText;
    button.disabled = false;
  };
}

// =====================================================
// PREDICTION FUNCTIONS
// =====================================================

async function submitPrediction() {
  if (!lucid) {
    log("❌ Please connect wallet first", "error");
    return;
  }

  const stopLoading = showLoading("submit");
  
  try {
    // Get form values
    const targetEpoch = BigInt(document.getElementById("epoch").value);
    const predictedPrice = BigInt(document.getElementById("price").value);
    const stakeAda = BigInt(document.getElementById("stake").value) * 1_000_000n;
    const oracleAddr = document.getElementById("oracle").value.trim();

    // Validation
    if (!targetEpoch || targetEpoch <= 0) {
      throw new Error("Please enter a valid target epoch");
    }
    
    if (!predictedPrice || predictedPrice <= 0) {
      throw new Error("Please enter a valid price prediction");
    }
    
    if (!stakeAda || stakeAda < CONFIG.MIN_STAKE) {
      throw new Error(`Minimum stake is ${CONFIG.MIN_STAKE / 1_000_000n} ADA`);
    }
    
    if (!oracleAddr || !oracleAddr.startsWith("addr_test")) {
      throw new Error("Please enter a valid testnet oracle address");
    }

    // Get key hashes
    const predictorDetails = lucid.utils.getAddressDetails(walletAddress);
    const oracleDetails = lucid.utils.getAddressDetails(oracleAddr);
    
    if (!predictorDetails.paymentCredential || !oracleDetails.paymentCredential) {
      throw new Error("Invalid addresses provided");
    }
    
    const predictorPkh = predictorDetails.paymentCredential.hash;
    const oraclePkh = oracleDetails.paymentCredential.hash;

    // Create datum
    const datum = Data.to(
      {
        ppPredictor: predictorPkh,
        ppTargetEpoch: targetEpoch,
        ppPredictedPrice: predictedPrice,
        ppStake: stakeAda,
        ppOracle: oraclePkh,
        ppResolved: false,
      },
      PricePredictionDatum
    );

    // Build transaction
    const tx = await lucid
      .newTx()
      .payToContract(
        scriptAddress,
        { inline: datum },
        { lovelace: stakeAda }
      )
      .addSignerKey(predictorPkh)
      .complete();

    // Sign and submit
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    log(`✅ Prediction submitted! TX Hash: ${txHash}`, "success");
    log(`📊 Details: ${stakeAda / 1_000_000n} ADA staked for epoch ${targetEpoch}`, "info");
    
    // Clear form
    document.getElementById("stake").value = "";
    
  } catch (error) {
    log(`❌ Submission failed: ${error.message}`, "error");
    console.error(error);
  } finally {
    stopLoading();
  }
}

// =====================================================
// ORACLE FUNCTIONS
// =====================================================

async function resolvePrediction() {
  if (!lucid) {
    log("❌ Please connect wallet first", "error");
    return;
  }

  const stopLoading = showLoading("resolve");
  
  try {
    // Get oracle key hash
    const oracleDetails = lucid.utils.getAddressDetails(walletAddress);
    const oraclePkh = oracleDetails.paymentCredential.hash;

    // Find unresolved predictions for this oracle
    const utxos = await lucid.utxosAt(scriptAddress);
    
    const unresolvedUtxos = utxos.filter(u => {
      if (!u.datum) return false;
      try {
        const datum = Data.from(u.datum, PricePredictionDatum);
        return datum.ppOracle === oraclePkh && datum.ppResolved === false;
      } catch {
        return false;
      }
    });

    if (unresolvedUtxos.length === 0) {
      log("ℹ️ No unresolved predictions found for your oracle address", "info");
      stopLoading();
      return;
    }

    log(`Found ${unresolvedUtxos.length} unresolved prediction(s)`, "info");

    // Resolve the first one (in production, you'd want to handle all)
    const utxo = unresolvedUtxos[0];
    const oldDatum = Data.from(utxo.datum, PricePredictionDatum);

    // Create resolved datum
    const newDatum = Data.to(
      {
        ...oldDatum,
        ppResolved: true,
      },
      PricePredictionDatum
    );

    // Build resolution transaction
    const redeemer = Data.to(new Constr(1, [])); // ResolvePrediction
    
    const tx = await lucid
      .newTx()
      .collectFrom([utxo], redeemer)
      .attachSpendingValidator(script)
      .payToContract(
        scriptAddress,
        { inline: newDatum },
        utxo.assets
      )
      .addSignerKey(oraclePkh)
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    log(`✅ Prediction resolved! TX Hash: ${txHash}`, "success");
    log(`🎯 Prediction for epoch ${oldDatum.ppTargetEpoch} is now resolved`, "info");

  } catch (error) {
    log(`❌ Resolution failed: ${error.message}`, "error");
    console.error(error);
  } finally {
    stopLoading();
  }
}

// =====================================================
// CLAIM FUNCTIONS
// =====================================================

async function claimReward() {
  if (!lucid) {
    log("❌ Please connect wallet first", "error");
    return;
  }

  const stopLoading = showLoading("claim");
  
  try {
    // Get predictor key hash
    const predictorDetails = lucid.utils.getAddressDetails(walletAddress);
    const predictorPkh = predictorDetails.paymentCredential.hash;

    // Find resolved predictions for this predictor
    const utxos = await lucid.utxosAt(scriptAddress);
    
    const resolvedUtxos = utxos.filter(u => {
      if (!u.datum) return false;
      try {
        const datum = Data.from(u.datum, PricePredictionDatum);
        return datum.ppPredictor === predictorPkh && datum.ppResolved === true;
      } catch {
        return false;
      }
    });

    if (resolvedUtxos.length === 0) {
      log("ℹ️ No resolved predictions found to claim", "info");
      stopLoading();
      return;
    }

    log(`Found ${resolvedUtxos.length} resolved prediction(s) to claim`, "info");

    // Claim the first one
    const utxo = resolvedUtxos[0];
    const datum = Data.from(utxo.datum, PricePredictionDatum);

    // Build claim transaction
    const redeemer = Data.to(new Constr(2, [])); // ClaimReward
    
    const tx = await lucid
      .newTx()
      .collectFrom([utxo], redeemer)
      .attachSpendingValidator(script)
      .payToAddress(walletAddress, {
        lovelace: datum.ppStake,
      })
      .addSignerKey(predictorPkh)
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    const rewardAda = datum.ppStake / 1_000_000n;
    log(`💰 Reward claimed! TX Hash: ${txHash}`, "success");
    log(`🎉 ${rewardAda} ADA returned to your wallet`, "success");

  } catch (error) {
    log(`❌ Claim failed: ${error.message}`, "error");
    console.error(error);
  } finally {
    stopLoading();
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

async function checkUnresolvedPredictions() {
  if (!lucid) {
    log("❌ Please connect wallet first", "error");
    return;
  }

  try {
    const oracleDetails = lucid.utils.getAddressDetails(walletAddress);
    const oraclePkh = oracleDetails.paymentCredential.hash;
    
    const utxos = await lucid.utxosAt(scriptAddress);
    
    const unresolved = utxos.filter(u => {
      if (!u.datum) return false;
      try {
        const datum = Data.from(u.datum, PricePredictionDatum);
        return datum.ppOracle === oraclePkh && datum.ppResolved === false;
      } catch {
        return false;
      }
    });

    if (unresolved.length === 0) {
      log("✅ No unresolved predictions found for your oracle", "success");
    } else {
      log(`📋 Found ${unresolved.length} unresolved prediction(s):`, "info");
      unresolved.forEach((utxo, i) => {
        const datum = Data.from(utxo.datum, PricePredictionDatum);
        log(`  ${i+1}. Epoch: ${datum.ppTargetEpoch}, Stake: ${datum.ppStake / 1_000_000n} ADA`, "info");
      });
    }
    
  } catch (error) {
    log(`❌ Check failed: ${error.message}`, "error");
  }
}

async function checkMyPredictions() {
  if (!lucid) {
    log("❌ Please connect wallet first", "error");
    return;
  }

  try {
    const predictorDetails = lucid.utils.getAddressDetails(walletAddress);
    const predictorPkh = predictorDetails.paymentCredential.hash;
    
    const utxos = await lucid.utxosAt(scriptAddress);
    
    const myPredictions = utxos.filter(u => {
      if (!u.datum) return false;
      try {
        const datum = Data.from(u.datum, PricePredictionDatum);
        return datum.ppPredictor === predictorPkh;
      } catch {
        return false;
      }
    });

    if (myPredictions.length === 0) {
      log("📭 You have no active predictions", "info");
    } else {
      log(`📊 Your ${myPredictions.length} prediction(s):`, "info");
      myPredictions.forEach((utxo, i) => {
        const datum = Data.from(utxo.datum, PricePredictionDatum);
        const status = datum.ppResolved ? "✅ Resolved" : "⏳ Pending";
        log(`  ${i+1}. Epoch ${datum.ppTargetEpoch}: ${datum.ppStake / 1_000_000n} ADA - ${status}`, "info");
      });
    }
    
  } catch (error) {
    log(`❌ Check failed: ${error.message}`, "error");
  }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

document.getElementById("connect").addEventListener("click", init);
document.getElementById("submit").addEventListener("click", submitPrediction);
document.getElementById("resolve").addEventListener("click", resolvePrediction);
document.getElementById("claim").addEventListener("click", claimReward);
document.getElementById("fetchCurrent").addEventListener("click", fetchCurrentData);
document.getElementById("checkPredictions").addEventListener("click", checkUnresolvedPredictions);
document.getElementById("checkRewards").addEventListener("click", checkMyPredictions);
document.getElementById("clearLog").addEventListener("click", () => {
  document.getElementById("log").innerHTML = "";
  log("Log cleared", "info");
});

// Auto-fill example oracle address on load
document.addEventListener("DOMContentLoaded", () => {
  // Example oracle address (replace with your actual oracle address)
  document.getElementById("oracle").value = "addr_test1qzx9hu8j4ah3auytk0mwcupd69hpc52t0cw39a65ndrah86djs784u92a3m5w475w3w35tyd6v3qumkze80j8a6h5tuqq5xe8y";
  
  // Initial log message
  log("Welcome to ADA Predictor dApp!", "success");
  log("1. Connect your Lace wallet", "info");
  log("2. Enter prediction details", "info");
  log("3. Stake ADA and submit", "info");
});

// =====================================================
// EXPORT FOR DEBUGGING
// =====================================================

window.app = {
  lucid,
  walletAddress,
  scriptAddress,
  submitPrediction,
  resolvePrediction,
  claimReward,
  log,
};
