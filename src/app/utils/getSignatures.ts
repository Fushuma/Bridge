// Read signature endpoints from environment variables
export const sigs = [
  process.env.REACT_APP_SIG_URL_1 || '',
  process.env.REACT_APP_SIG_URL_2 || '',
  process.env.REACT_APP_SIG_URL_3 || '',
  process.env.REACT_APP_SIG_URL_4 || ''
].filter(url => url !== '');

export const requiredSignatures = 3;

const FETCH_TIMEOUT_MS = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchSig = async (url: string, retryCount = 0): Promise<Response | null> => {
  try {
    const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
    return res;
  } catch (e) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retryCount)));
      return fetchSig(url, retryCount + 1);
    }
    return null;
  }
};

const getSignaturesClaim = async (hash: string, chainId: string) => {
  const signatures: any[] = [];
  let respJSON: any;

  async function checkSignature(i: number) {
    const url = `${sigs[i]}auth?tx=${hash}&chain=${chainId}`;
    const resp = await fetchSig(url);

    if (!resp) {
      return;
    }

    respJSON = await resp.json();

    if (respJSON.isSuccess) {
      signatures.push(respJSON.signature);
      if (signatures.length >= requiredSignatures) {
        return { signatures, respJSON };
      }
    }
  }

  for (let i = 0; i < sigs.length; i++) {
    await checkSignature(i);
  }

  return { signatures, respJSON };
};

export const getSignaturesAddWrapped = async (token: `0x${string}`, chainId: number) => {
  const signatures: any[] = [];
  let respJSON: any;

  for (let i = 0; i < sigs.length; i++) {
    const url = `${sigs[i]}addToken?token=${token}&chain=${chainId}`;
    const resp = await fetchSig(url);

    if (!resp) {
      continue;
    }

    respJSON = await resp.json();

    if (respJSON.isSuccess) {
      signatures.push(respJSON.signature);
      if (signatures.length >= requiredSignatures) {
        return { signatures, respJSON };
      }
    }
  }

  return { signatures: [], respJSON };
};

export default getSignaturesClaim;
