export const sigs = [
  'https://mrs6x6ew7njwnad27dkhear7ya0tzbjy.lambda-url.eu-north-1.on.aws/',
  'https://7iurhujz7zfo4gx65p7ws7wliy0gaexu.lambda-url.eu-north-1.on.aws/',
  'https://3jb2sp2i7x27xmcol2qsetcvse0jgtzp.lambda-url.eu-north-1.on.aws/',
  'https://hvktatipoqgc74s6su4j3h273i0gaotl.lambda-url.us-east-1.on.aws/'
];

export const requiredSignatures = 3;

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch a single signature endpoint and return its parsed JSON body.
// Returns `null` instead of throwing when a server is unreachable, blocked by
// CORS, responds with an HTTP error (e.g. 403), or returns an unparsable body.
// This keeps one misbehaving server from aborting the whole signature round and
// avoids the fire-and-forget background retry loop the previous version spawned.
const fetchSigJSON = async (url: string): Promise<any | null> => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // HTTP error (403/5xx/etc). Don't retry – it won't recover in time.
        console.warn(`Signature server responded with ${res.status}: ${url}`);
        return null;
      }
      return await res.json();
    } catch (e) {
      // Network / CORS failure. Retry once for transient blips, then give up.
      console.warn(`Signature server request failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${url}`, e);
      if (attempt < MAX_ATTEMPTS) {
        await delay(RETRY_DELAY_MS);
      }
    }
  }
  return null;
};

const collectSignatures = async (buildUrl: (base: string) => string) => {
  const signatures: any[] = [];
  let respJSON: any;

  for (let i = 0; i < sigs.length; i++) {
    if (signatures.length >= requiredSignatures) break;

    const json = await fetchSigJSON(buildUrl(sigs[i]));
    if (json && json.isSuccess) {
      respJSON = json;
      signatures.push(json.signature);
    }
  }

  return { signatures, respJSON };
};

const getSignaturesClaim = async (hash: string, chainId: string) => {
  return collectSignatures((base) => `${base}auth?tx=${hash}&chain=${chainId}`);
};

export const getSignaturesAddWrapped = async (token: `0x${string}`, chainId: number) => {
  const { signatures, respJSON } = await collectSignatures(
    (base) => `${base}addToken?token=${token}&chain=${chainId}`
  );

  if (signatures.length < requiredSignatures) {
    return { signatures: [], respJSON };
  }

  return { signatures, respJSON };
};

// const getFirstSig = async (url: string) => {
//   const resp = await fetchSig(url);
//   const respJSON = await resp.json();

//   if (!respJSON.isSuccess) {
//     // alert('ERROR - 1: Authorization failed!');
//     return null;
//   }
//   return respJSON.signature;
// };

// const getSecondSig = async (url: string) => {
//   const url = `${sigs[1]}tx=${hash}&chain=${chainId}`;
//   const resp = await fetchSig(url);
//   const respJSON = await resp.json();

//   if (!respJSON.isSuccess) {
//     // alert('ERROR - 2: Authorization failed!');
//     return null;
//   }
//   return respJSON.signature;
// };

// const getThirdSig = async (hash: string, chainId: string) => {
//   const url = `${sigs[2]}tx=${hash}&chain=${chainId}`;
//   const resp = await fetchSig(url);
//   const respJSON = await resp.json();

//   if (!respJSON.isSuccess) {
//     // alert('ERROR - 3: Authorization failed!');
//     return { sig3: null, respJSON: null };
//   }
//   return { sig3: respJSON.signature, respJSON };
// };

export default getSignaturesClaim;
