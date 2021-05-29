var CAPICOM_STORE_OPEN_READ_ONLY = 0;
var CAPICOM_CURRENT_USER_STORE = 2;
var CAPICOM_SMART_CARD_USER_STORE = 4;
var CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;
var CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY = 6;
var CAPICOM_CERTIFICATE_FIND_TIME_VALID = 9;
var CAPICOM_CERTIFICATE_FIND_KEY_USAGE = 12;
var CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE = 0x00000080;
var CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0;
var CAPICOM_INFO_SUBJECT_SIMPLE_NAME = 0;
var CAPICOM_ENCODE_BASE64 = 0;
var CAPICOM_E_CANCELLED = -2138568446;
var CERT_KEY_SPEC_PROP_ID = 6;
var CAPICOM_HASH_ALGORITHM_SHA1 = 0;

var CAPICOM_CHECK_NONE = 0;
var CAPICOM_CHECK_TRUSTED_ROOT = 1;
var CAPICOM_CHECK_TIME_VALIDITY = 2;
var CAPICOM_CHECK_SIGNATURE_VALIDITY = 4;
var CAPICOM_CHECK_ONLINE_REVOCATION_STATUS = 8;
var CAPICOM_CHECK_OFFLINE_REVOCATION_STATUS = 16;

var CAPICOM_TRUST_IS_NOT_TIME_VALID = 1;
var CAPICOM_TRUST_IS_NOT_TIME_NESTED = 2;
var CAPICOM_TRUST_IS_REVOKED = 4;
var CAPICOM_TRUST_IS_NOT_SIGNATURE_VALID = 8;
var CAPICOM_TRUST_IS_NOT_VALID_FOR_USAGE = 16;
var CAPICOM_TRUST_IS_UNTRUSTED_ROOT = 32;
var CAPICOM_TRUST_REVOCATION_STATUS_UNKNOWN = 64;
var CAPICOM_TRUST_IS_CYCLIC = 128;
var CAPICOM_TRUST_IS_PARTIAL_CHAIN = 65536;
var CAPICOM_TRUST_CTL_IS_NOT_TIME_VALID = 131072;
var CAPICOM_TRUST_CTL_IS_NOT_SIGNATURE_VALID = 262144;
var CAPICOM_TRUST_CTL_IS_NOT_VALID_FOR_USAGE = 524288;
var CAPICOM_VERIFY_SIGNATURE_ONLY = 0;

var CAPICOM_ENCRYPTION_ALGORITHM_RC2 = 0;
var CAPICOM_ENCRYPTION_ALGORITHM_RC4 = 1;
var CAPICOM_ENCRYPTION_ALGORITHM_DES = 2;
var CAPICOM_ENCRYPTION_ALGORITHM_3DES = 3;
var CAPICOM_ENCRYPTION_ALGORITHM_AES = 4;
var CAPICOM_ENCRYPTION_KEY_LENGTH_MAXIMUM = 0;
var CAPICOM_ENCRYPTION_KEY_LENGTH_40_BITS = 1;
var CAPICOM_ENCRYPTION_KEY_LENGTH_56_BITS = 2;
var CAPICOM_ENCRYPTION_KEY_LENGTH_128_BITS = 3;
var CAPICOM_ENCRYPTION_KEY_LENGTH_192_BITS = 4;
var CAPICOM_ENCRYPTION_KEY_LENGTH_256_BITS = 5;
var CAPICOM_SECRET_PASSWORD = 0;
var CAPICOM_ENCODE_BASE64 = 0;
var CAPICOM_ENCODE_BINARY = 1;
var CAPICOM_ENCODE_ANY = -1;
var CAPICOM_VERIFY_SIGNATURE_AND_CERTIFICATE = 1;

var MyStore = new ActiveXObject("CAPICOM.Store");
var FilteredCertificates = new ActiveXObject("CAPICOM.Certificates");
var Certificate = null;

var req;
var sender;

function IsCAPICOMInstalled() {
  if (typeof oCAPICOM == "object") {
    if (oCAPICOM.object != null) {
      // We found CAPICOM!
      return true;
    } else return false;
  } else return false;
}

//**************************************
function checkCertStatus(szThumbprint) {
  if (IsCAPICOMInstalled) {
    // find the certificate specified!
    var Certificates = FindCertificateByThumbprint(szThumbprint);
    Certificate = Certificates.Item(1);

    window.status = "Checking Certificate Status....";
    // CAPICOM exposes Certificate status checking through IsValid, the CheckFlag parameter
    // allows you to specify the items you want to have checked for you.
    Certificate.IsValid().CheckFlag =
      CAPICOM_CHECK_TRUSTED_ROOT |
      CAPICOM_CHECK_TIME_VALIDITY |
      CAPICOM_CHECK_SIGNATURE_VALIDITY; //| CAPICOM_CHECK_ONLINE_REVOCATION_STATUS
    if (Certificate.IsValid().Result == true) {
      // clear the status window
      window.status = "";
      //alert(".مورد تائید است \"" +  Certificate.GetInfo(CAPICOM_INFO_SUBJECT_SIMPLE_NAME) + "\"اعتبار گواهی دیجیتال ");
      return true;
    } else {
      var Chain = new ActiveXObject("CAPICOM.Chain");
      Chain.Build(Certificate);

      // clear the status window
      window.status = "";
      if (CAPICOM_TRUST_IS_NOT_SIGNATURE_VALID & Chain.Status) {
        alert(
          "CryptoAPI found a problem with the signature on '" +
            Certificate.GetInfo(CAPICOM_INFO_SUBJECT_SIMPLE_NAME) +
            "'"
        );
        return false;
      }
      if (
        CAPICOM_TRUST_IS_UNTRUSTED_ROOT & Chain.Status ||
        CAPICOM_TRUST_IS_PARTIAL_CHAIN & Chain.Status
      ) {
        alert(
          "CryptoAPI was unable to chain '" +
            Certificate.GetInfo(CAPICOM_INFO_SUBJECT_SIMPLE_NAME) +
            "' to a trusted authority"
        );
        return false;
      }
      if (CAPICOM_TRUST_IS_CYCLIC & Chain.Status) {
        alert("CAPICOM_TRUST_IS_CYCLIC");
        return false;
      }
      if (CAPICOM_TRUST_CTL_IS_NOT_TIME_VALID & Chain.Status) {
        alert("CAPICOM_TRUST_CTL_IS_NOT_TIME_VALID");
        return false;
      }
      if (CAPICOM_TRUST_CTL_IS_NOT_SIGNATURE_VALID & Chain.Status) {
        alert("CAPICOM_TRUST_CTL_IS_NOT_SIGNATURE_VALID");
        return false;
      }
      if (CAPICOM_TRUST_CTL_IS_NOT_VALID_FOR_USAGE & Chain.Status) {
        alert("CAPICOM_TRUST_CTL_IS_NOT_VALID_FOR_USAGE");
        return false;
      }
      if (CAPICOM_TRUST_IS_NOT_TIME_VALID & Chain.Status) {
        alert("CAPICOM_TRUST_IS_NOT_TIME_VALID");
        return false;
      }
      if (CAPICOM_TRUST_IS_NOT_TIME_NESTED & Chain.Status) {
        alert("CAPICOM_TRUST_IS_NOT_TIME_NESTED");
        return false;
      }
      if (CAPICOM_TRUST_IS_NOT_VALID_FOR_USAGE & Chain.Status) {
        alert("CAPICOM_TRUST_IS_NOT_VALID_FOR_USAGE");
        return false;
      }
      if (CAPICOM_TRUST_IS_REVOKED & Chain.Status) {
        alert(
          "CryptoAPI determined that '" +
            Certificate.GetInfo(CAPICOM_INFO_SUBJECT_SIMPLE_NAME) +
            "' or one of its issuers was revoked."
        );
        return false;
      }
      if (CAPICOM_TRUST_REVOCATION_STATUS_UNKNOWN & Chain.Status) {
        alert(
          "اعتبار گواهي ديجيتال " +
            Certificate.GetInfo(CAPICOM_INFO_SUBJECT_SIMPLE_NAME) +
            "قابل تاييد نمي باشد"
        );
        return false;
      }
    }
  } else return false;
}
//**************************************
function FindCertificateByThumbprint(szThumbprint) {
  // instantiate the CAPICOM objects
  var MyStore = new ActiveXObject("CAPICOM.Store");
  //var AddrStore = new ActiveXObject("CAPICOM.Store");
  var CAStore = new ActiveXObject("CAPICOM.Store");
  var RootStore = new ActiveXObject("CAPICOM.Store");
  var FoundCertificates = new ActiveXObject("CAPICOM.Certificates");

  // open the store objects
  try {
    MyStore.Open(
      CAPICOM_CURRENT_USER_STORE,
      "My",
      CAPICOM_STORE_OPEN_READ_ONLY
    );
    //AddrStore.Open(CAPICOM_CURRENT_USER_STORE, "AddressBook", CAPICOM_STORE_OPEN_READ_ONLY);
    CAStore.Open(
      CAPICOM_CURRENT_USER_STORE,
      "CA",
      CAPICOM_STORE_OPEN_READ_ONLY
    );
    RootStore.Open(
      CAPICOM_CURRENT_USER_STORE,
      "Root",
      CAPICOM_STORE_OPEN_READ_ONLY
    );
  } catch (e) {
    alert("An error occurred while opening your certificate stores, aborting");
    return false;
  }

  // this may take a second so lets update the user with what we are doing
  window.status =
    "Finding Certificate with the Thumbprint of " + szThumbprint + ".";

  // create an array of all of the stores
  MyStores = new Array(MyStore, CAStore, RootStore);

  // enumerate through the stores
  for (iStore = 0; iStore <= MyStores.length - 1; iStore++) {
    // look for our thumbprint in this store
    var Certificates = MyStores[iStore].Certificates.Find(
      CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
      szThumbprint
    );

    // enumerate through each of the certificates we found (if any)
    for (iCert = 1; iCert <= Certificates.Count; iCert++) {
      FoundCertificates.Add(Certificates.Item(iCert));
    }
  }

  // update the status
  window.status = "";

  // return the certificate
  if (typeof FoundCertificates == "object") {
    return FoundCertificates;
  }
}
//**************************************
function init() {
  // The installation of CAPICOM is dependant on various security permissions on the host pc
  // some of these permissions include:
  // * read and create permissions to the HKR key in the registry (to register the object)
  // * read permissions to the capicom.dll on the file system
  //
  // If a user does not have said permissions you will not be able to Instantiate the object
  // as such your code will not work. So prior to utilizing any of the objects implemented
  // by CAPICOM we will check to see if it has been installed.
  if (IsCAPICOMInstalled() != true) {
    // Alert the that CAPICOM was not able to be installed
    // alert("CAPICOM could not be loaded, possibly due to insufficient access privileges on this machine.");
    alert("امکان دسترسی به فایل کتابخانه ای امضای دیجیتال وجود ندارد");
  }
}
//**************************************

function CheckToken(szThumbprint) {
  if (szThumbprint == "") {
    alert("لطفا سخت افزار حاوي گواهي ديجيتال خود را به كامپيوتر متصل نمائيد");
    return false;
  }

  try {
    MyStore.Open(2, "My", 0);

    FilteredCertificates = MyStore.Certificates;

    if (FilteredCertificates.Count > 0) {
      Certificate = new ActiveXObject("CAPICOM.Certificate");
      if (szThumbprint != "")
        Certificate = FindCertificateByThumbprint(szThumbprint).Item(1);
      else Certificate = SelectCert();

      if (Certificate.Thumbprint.toUpperCase() == szThumbprint.toUpperCase()) {
        if (checkCertStatus(szThumbprint)) return true;
        else return false;
      } else {
        alert(
          "گواهي ديجيتال موجود در سخت افزار متعلق به كد كاربري وارد شده نمي باشد"
        );
        return false;
      }
    } else {
      alert("لطفا سخت افزار حاوي گواهي ديجيتال خود را به كامپيوتر متصل نمائيد");
      return false;
    }
  } catch (e) {
    if (e.number != CAPICOM_E_CANCELLED) {
      alert(
        "An error occurred while opening your personal certificate store, aborting"
      );
      alert(e.description);
      return false;
    }
  }
}
//**************************************

function CheckLoginToken(szThumbprint) {
  if (checkCertStatus(szThumbprint)) {
    return true;
  } else return false;
}

//**************************************

function DoHash(val) {
  var HashedData = new ActiveXObject("CAPICOM.HashedData");
  HashedData.Algorithm = CAPICOM_HASH_ALGORITHM_SHA1;
  HashedData.Hash(val);
  return HashedData.Value;
}

//**************************************
function DoSign(val, UserCert) {
  if (!CheckToken(UserCert)) {
    throw "لطفا سخت افزار حاوي گواهي ديجيتال خود را به كامپيوتر متصل نمائيد";
  }
  var SignedData = new ActiveXObject("CAPICOM.SignedData");
  var Signer = new ActiveXObject("CAPICOM.Signer");
  var TimeAttribute = new ActiveXObject("CAPICOM.Attribute");
  SignedData.Content = val;

  try {
    Signer.Certificate = Certificate;
    var Today = new Date();
    TimeAttribute.Name = CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME;
    TimeAttribute.Value = Today.getVarDate();
    Today = null;
    Signer.AuthenticatedAttributes.Add(TimeAttribute);

    // Do the Sign operation
    szSignature = SignedData.Sign(Signer, false, CAPICOM_ENCODE_BASE64);
    return szSignature;
  } catch (e) {
    throw e.description;
  }
}
//**************************************
function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}
//**************************************
function readCookie(name) {
  var nameEQ = name + "=";
  alert(document.cookie);
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
//**************************************
function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    c_name +
    "=" +
    escape(value) +
    (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
}
//**************************************
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}
//**************************************
function makeRequest(url, Func, Method, Param) {
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    req = new ActiveXObject("Microsoft.XMLHTTP");
  }

  //req = new XMLHttpRequest();

  req.onreadystatechange = Func;

  req.open(Method, url, true);
  if (Method == "GET") req.send(null);
  else {
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", Param.length);
    req.setRequestHeader("Connection", "close");

    req.send(Param);
  }
}
//**************************************
function encryptMessage(Code, Message) {
  var ed = new ActiveXObject("CAPICOM.EncryptedData");
  ed.SetSecret(code);
  ed.Algorithm.Name = CAPICOM_ENCRYPTION_ALGORITHM_DES;
  ed.Content = Message;
  return ed.Encrypt();
}
//**************************************
function SignMessage(Message) {
  var Sign = new ActiveXObject("CAPICOM.SignedData");
  var Signer = new ActiveXObject("CAPICOM.Signer");
  Signer.Certificate = Getcertificate();
  Sign.Content = Message;
  return Sign.Sign(Signer, false);
}
//**************************************
function CheckSign(Message, SignDATA) {
  var Sign = new ActiveXObject("CAPICOM.SignedData");
  try {
    Sign.Verify(SignDATA, false, CAPICOM_VERIFY_SIGNATURE_ONLY);
    alert("sign is OK");
  } catch (ex) {
    alert(ex.message);
  }
  return;
}
//**************************************
function decryptMessage(Code, Message) {
  var ed = new ActiveXObject("CAPICOM.EncryptedData");
  ed.SetSecret(Code);
  ed.Algorithm.Name = CAPICOM_ENCRYPTION_ALGORITHM_DES;
  ed.Decrypt(Message);
  return ed.Content;
}
//**************************************
function SelectCert() {
  var selectedCert;

  FilterCertificates();

  if (FilteredCertificates.Count > 1) {
    selectedCert = FilteredCertificates.Select();
    return selectedCert.Item(1);
  } else if (FilteredCertificates.Count == 1) {
    selectedCert = FilteredCertificates.Item(1);
    return selectedCert;
  } else {
    alert("!گواهی دیجیتال مورد تائید یافت نشد");
    return false;
  }
}
//**************************************
function FilterCertificates() {
  // open the current users personal certificate store
  try {
    MyStore.Open(
      CAPICOM_CURRENT_USER_STORE,
      "My",
      CAPICOM_STORE_OPEN_READ_ONLY
    );
  } catch (e) {
    if (e.number != CAPICOM_E_CANCELLED) {
      alert(
        "An error occurred while opening your personal certificate store, aborting"
      );
      return false;
    }
  }

  // find all of the certificates that:
  //   * Are they time valid

  FilteredCertificates = MyStore.Certificates.Find(
    CAPICOM_CERTIFICATE_FIND_TIME_VALID
  );
  return FilteredCertificates;
}
//**************************************
function exportcer() {
  var o = SelectCert();
  o(1).Save("c:\\test.cer");
}
//**************************************
//UTF8
//**************************************
function chr(code) {
  return String.fromCharCode(code);
}
//**************************************
//returns utf8 encoded charachter of a unicode value.
//code must be a number indicating the Unicode value.
//returned value is a string between 1 and 4 charachters.
//**************************************
function code2utf(code) {
  if (code == 1740) code = 1610;
  if (code == 1603) code = 1705;
  if (code < 128) return chr(code);
  if (code < 2048) return chr(192 + (code >> 6)) + chr(128 + (code & 63));
  if (code < 65536)
    return (
      chr(224 + (code >> 12)) +
      chr(128 + ((code >> 6) & 63)) +
      chr(128 + (code & 63))
    );
  if (code < 2097152)
    return (
      chr(240 + (code >> 18)) +
      chr(128 + ((code >> 12) & 63)) +
      chr(128 + ((code >> 6) & 63)) +
      chr(128 + (code & 63))
    );
}
//**************************************
//it is a private function for internal use in utf8Encode function
function _utf8Encode(str) {
  var utf8str = new Array();
  for (var i = 0; i < str.length; i++) {
    utf8str[i] = code2utf(str.charCodeAt(i));
  }
  return utf8str.join("");
}
//**************************************
//Encodes a unicode string to UTF8 format.
function utf8Encode(str) {
  var utf8str = new Array();
  var pos,
    j = 0;
  var tmpStr = "";

  while ((pos = str.search(/[^\x00-\x7F]/)) != -1) {
    tmpStr = str.match(/([^\x00-\x7F]+[\x00-\x7F]{0,10})+/)[0];
    utf8str[j++] = str.substr(0, pos);
    utf8str[j++] = _utf8Encode(tmpStr);
    str = str.substr(pos + tmpStr.length);
  }

  utf8str[j++] = str;
  return utf8str.join("");
}
//**************************************
//it is a private function for internal use in utf8Decode function
function _utf8Decode(utf8str) {
  var str = new Array();
  var code,
    code2,
    code3,
    code4,
    j = 0;
  for (var i = 0; i < utf8str.length; ) {
    code = utf8str.charCodeAt(i++);
    if (code > 127) code2 = utf8str.charCodeAt(i++);
    if (code > 223) code3 = utf8str.charCodeAt(i++);
    if (code > 239) code4 = utf8str.charCodeAt(i++);

    if (code < 128) str[j++] = chr(code);
    else if (code < 224) str[j++] = chr(((code - 192) << 6) + (code2 - 128));
    else if (code < 240)
      str[j++] = chr(
        ((code - 224) << 12) + ((code2 - 128) << 6) + (code3 - 128)
      );
    else
      str[j++] = chr(
        ((code - 240) << 18) +
          ((code2 - 128) << 12) +
          ((code3 - 128) << 6) +
          (code4 - 128)
      );
  }
  return str.join("");
}
//**************************************
//Decodes a UTF8 formated string
function utf8Decode(utf8str) {
  var str = new Array();
  var pos = 0;
  var tmpStr = "";
  var j = 0;
  while ((pos = utf8str.search(/[^\x00-\x7F]/)) != -1) {
    tmpStr = utf8str.match(/([^\x00-\x7F]+[\x00-\x7F]{0,10})+/)[0];
    str[j++] = utf8str.substr(0, pos) + _utf8Decode(tmpStr);
    utf8str = utf8str.substr(pos + tmpStr.length);
  }

  str[j++] = utf8str;
  return str.join("");
}
//**************************************
//Encodes data to Base64 format
function base64Encode(data) {
  if (typeof btoa == "function") return btoa(data); //use internal base64 functions if available (gecko only)
  var b64_map =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var byte1, byte2, byte3;
  var ch1, ch2, ch3, ch4;
  var result = new Array(); //array is used instead of string because in most of browsers working with large arrays is faster than working with large strings
  var j = 0;
  for (var i = 0; i < data.length; i += 3) {
    byte1 = data.charCodeAt(i);
    byte2 = data.charCodeAt(i + 1);
    byte3 = data.charCodeAt(i + 2);
    ch1 = byte1 >> 2;
    ch2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    ch3 = ((byte2 & 15) << 2) | (byte3 >> 6);
    ch4 = byte3 & 63;

    if (isNaN(byte2)) {
      ch3 = ch4 = 64;
    } else if (isNaN(byte3)) {
      ch4 = 64;
    }

    result[j++] =
      b64_map.charAt(ch1) +
      b64_map.charAt(ch2) +
      b64_map.charAt(ch3) +
      b64_map.charAt(ch4);
  }

  return result.join("");
}
//**************************************
//Decodes Base64 formated data
function base64Decode(data) {
  data = data.replace(/[^a-z0-9\+\/=]/gi, ""); // strip none base64 characters
  if (typeof atob == "function") return atob(data); //use internal base64 functions if available (gecko only)
  var b64_map =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var byte1, byte2, byte3;
  var ch1, ch2, ch3, ch4;
  var result = new Array(); //array is used instead of string because in most of browsers working with large arrays is faster than working with large strings
  var j = 0;
  while (data.length % 4 != 0) {
    data += "=";
  }

  for (var i = 0; i < data.length; i += 4) {
    ch1 = b64_map.indexOf(data.charAt(i));
    ch2 = b64_map.indexOf(data.charAt(i + 1));
    ch3 = b64_map.indexOf(data.charAt(i + 2));
    ch4 = b64_map.indexOf(data.charAt(i + 3));

    byte1 = (ch1 << 2) | (ch2 >> 4);
    byte2 = ((ch2 & 15) << 4) | (ch3 >> 2);
    byte3 = ((ch3 & 3) << 6) | ch4;

    result[j++] = String.fromCharCode(byte1);
    if (ch3 != 64) result[j++] = String.fromCharCode(byte2);
    if (ch4 != 64) result[j++] = String.fromCharCode(byte3);
  }

  return result.join("");
}
//**************************************
function Hash(Message) {
  var sha = new ActiveXObject("CAPICOM.HashedData");
  sha.Algorithm.Name = CAPICOM_HASH_ALGORITHM_SHA1;
  sha.Hash(base64Encode(utf8Encode(Message)));
  return sha.Value;
}
