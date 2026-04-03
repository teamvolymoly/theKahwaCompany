"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/utils/api";

export default function AccountClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { login, authLoading, error: loginError } = useAuth();

  const countryCodes = [
    { code: "+1", label: "United States", iso: "us" },
    { code: "+1", label: "Canada", iso: "ca" },
    { code: "+7", label: "Russia", iso: "ru" },
    { code: "+20", label: "Egypt", iso: "eg" },
    { code: "+27", label: "South Africa", iso: "za" },
    { code: "+30", label: "Greece", iso: "gr" },
    { code: "+31", label: "Netherlands", iso: "nl" },
    { code: "+32", label: "Belgium", iso: "be" },
    { code: "+33", label: "France", iso: "fr" },
    { code: "+34", label: "Spain", iso: "es" },
    { code: "+36", label: "Hungary", iso: "hu" },
    { code: "+39", label: "Italy", iso: "it" },
    { code: "+40", label: "Romania", iso: "ro" },
    { code: "+41", label: "Switzerland", iso: "ch" },
    { code: "+43", label: "Austria", iso: "at" },
    { code: "+44", label: "United Kingdom", iso: "gb" },
    { code: "+45", label: "Denmark", iso: "dk" },
    { code: "+46", label: "Sweden", iso: "se" },
    { code: "+47", label: "Norway", iso: "no" },
    { code: "+48", label: "Poland", iso: "pl" },
    { code: "+49", label: "Germany", iso: "de" },
    { code: "+51", label: "Peru", iso: "pe" },
    { code: "+52", label: "Mexico", iso: "mx" },
    { code: "+53", label: "Cuba", iso: "cu" },
    { code: "+54", label: "Argentina", iso: "ar" },
    { code: "+55", label: "Brazil", iso: "br" },
    { code: "+56", label: "Chile", iso: "cl" },
    { code: "+57", label: "Colombia", iso: "co" },
    { code: "+58", label: "Venezuela", iso: "ve" },
    { code: "+60", label: "Malaysia", iso: "my" },
    { code: "+61", label: "Australia", iso: "au" },
    { code: "+62", label: "Indonesia", iso: "id" },
    { code: "+63", label: "Philippines", iso: "ph" },
    { code: "+64", label: "New Zealand", iso: "nz" },
    { code: "+65", label: "Singapore", iso: "sg" },
    { code: "+66", label: "Thailand", iso: "th" },
    { code: "+81", label: "Japan", iso: "jp" },
    { code: "+82", label: "South Korea", iso: "kr" },
    { code: "+84", label: "Vietnam", iso: "vn" },
    { code: "+86", label: "China", iso: "cn" },
    { code: "+90", label: "Turkey", iso: "tr" },
    { code: "+91", label: "India", iso: "in" },
    { code: "+92", label: "Pakistan", iso: "pk" },
    { code: "+93", label: "Afghanistan", iso: "af" },
    { code: "+94", label: "Sri Lanka", iso: "lk" },
    { code: "+95", label: "Myanmar", iso: "mm" },
    { code: "+98", label: "Iran", iso: "ir" },
    { code: "+211", label: "South Sudan", iso: "ss" },
    { code: "+212", label: "Morocco", iso: "ma" },
    { code: "+213", label: "Algeria", iso: "dz" },
    { code: "+216", label: "Tunisia", iso: "tn" },
    { code: "+218", label: "Libya", iso: "ly" },
    { code: "+220", label: "Gambia", iso: "gm" },
    { code: "+221", label: "Senegal", iso: "sn" },
    { code: "+222", label: "Mauritania", iso: "mr" },
    { code: "+223", label: "Mali", iso: "ml" },
    { code: "+224", label: "Guinea", iso: "gn" },
    { code: "+225", label: "Ivory Coast", iso: "ci" },
    { code: "+226", label: "Burkina Faso", iso: "bf" },
    { code: "+227", label: "Niger", iso: "ne" },
    { code: "+228", label: "Togo", iso: "tg" },
    { code: "+229", label: "Benin", iso: "bj" },
    { code: "+230", label: "Mauritius", iso: "mu" },
    { code: "+231", label: "Liberia", iso: "lr" },
    { code: "+232", label: "Sierra Leone", iso: "sl" },
    { code: "+233", label: "Ghana", iso: "gh" },
    { code: "+234", label: "Nigeria", iso: "ng" },
    { code: "+235", label: "Chad", iso: "td" },
    { code: "+236", label: "Central African Republic", iso: "cf" },
    { code: "+237", label: "Cameroon", iso: "cm" },
    { code: "+238", label: "Cape Verde", iso: "cv" },
    { code: "+239", label: "Sao Tome and Principe", iso: "st" },
    { code: "+240", label: "Equatorial Guinea", iso: "gq" },
    { code: "+241", label: "Gabon", iso: "ga" },
    { code: "+242", label: "Congo", iso: "cg" },
    { code: "+243", label: "DR Congo", iso: "cd" },
    { code: "+244", label: "Angola", iso: "ao" },
    { code: "+245", label: "Guinea-Bissau", iso: "gw" },
    { code: "+246", label: "Diego Garcia", iso: "io" },
    { code: "+248", label: "Seychelles", iso: "sc" },
    { code: "+249", label: "Sudan", iso: "sd" },
    { code: "+250", label: "Rwanda", iso: "rw" },
    { code: "+251", label: "Ethiopia", iso: "et" },
    { code: "+252", label: "Somalia", iso: "so" },
    { code: "+253", label: "Djibouti", iso: "dj" },
    { code: "+254", label: "Kenya", iso: "ke" },
    { code: "+255", label: "Tanzania", iso: "tz" },
    { code: "+256", label: "Uganda", iso: "ug" },
    { code: "+257", label: "Burundi", iso: "bi" },
    { code: "+258", label: "Mozambique", iso: "mz" },
    { code: "+260", label: "Zambia", iso: "zm" },
    { code: "+261", label: "Madagascar", iso: "mg" },
    { code: "+262", label: "Reunion", iso: "re" },
    { code: "+263", label: "Zimbabwe", iso: "zw" },
    { code: "+264", label: "Namibia", iso: "na" },
    { code: "+265", label: "Malawi", iso: "mw" },
    { code: "+266", label: "Lesotho", iso: "ls" },
    { code: "+267", label: "Botswana", iso: "bw" },
    { code: "+268", label: "Eswatini", iso: "sz" },
    { code: "+269", label: "Comoros", iso: "km" },
    { code: "+350", label: "Gibraltar", iso: "gi" },
    { code: "+351", label: "Portugal", iso: "pt" },
    { code: "+352", label: "Luxembourg", iso: "lu" },
    { code: "+353", label: "Ireland", iso: "ie" },
    { code: "+354", label: "Iceland", iso: "is" },
    { code: "+355", label: "Albania", iso: "al" },
    { code: "+356", label: "Malta", iso: "mt" },
    { code: "+357", label: "Cyprus", iso: "cy" },
    { code: "+358", label: "Finland", iso: "fi" },
    { code: "+359", label: "Bulgaria", iso: "bg" },
    { code: "+370", label: "Lithuania", iso: "lt" },
    { code: "+371", label: "Latvia", iso: "lv" },
    { code: "+372", label: "Estonia", iso: "ee" },
    { code: "+373", label: "Moldova", iso: "md" },
    { code: "+374", label: "Armenia", iso: "am" },
    { code: "+375", label: "Belarus", iso: "by" },
    { code: "+376", label: "Andorra", iso: "ad" },
    { code: "+377", label: "Monaco", iso: "mc" },
    { code: "+378", label: "San Marino", iso: "sm" },
    { code: "+380", label: "Ukraine", iso: "ua" },
    { code: "+381", label: "Serbia", iso: "rs" },
    { code: "+382", label: "Montenegro", iso: "me" },
    { code: "+385", label: "Croatia", iso: "hr" },
    { code: "+386", label: "Slovenia", iso: "si" },
    { code: "+387", label: "Bosnia and Herzegovina", iso: "ba" },
    { code: "+389", label: "North Macedonia", iso: "mk" },
    { code: "+420", label: "Czech Republic", iso: "cz" },
    { code: "+421", label: "Slovakia", iso: "sk" },
    { code: "+423", label: "Liechtenstein", iso: "li" },
    { code: "+500", label: "Falkland Islands", iso: "fk" },
    { code: "+501", label: "Belize", iso: "bz" },
    { code: "+502", label: "Guatemala", iso: "gt" },
    { code: "+503", label: "El Salvador", iso: "sv" },
    { code: "+504", label: "Honduras", iso: "hn" },
    { code: "+505", label: "Nicaragua", iso: "ni" },
    { code: "+506", label: "Costa Rica", iso: "cr" },
    { code: "+507", label: "Panama", iso: "pa" },
    { code: "+508", label: "Saint Pierre and Miquelon", iso: "pm" },
    { code: "+509", label: "Haiti", iso: "ht" },
    { code: "+590", label: "Guadeloupe", iso: "gp" },
    { code: "+591", label: "Bolivia", iso: "bo" },
    { code: "+592", label: "Guyana", iso: "gy" },
    { code: "+593", label: "Ecuador", iso: "ec" },
    { code: "+594", label: "French Guiana", iso: "gf" },
    { code: "+595", label: "Paraguay", iso: "py" },
    { code: "+596", label: "Martinique", iso: "mq" },
    { code: "+597", label: "Suriname", iso: "sr" },
    { code: "+598", label: "Uruguay", iso: "uy" },
    { code: "+599", label: "Caribbean Netherlands", iso: "bq" },
    { code: "+670", label: "East Timor", iso: "tl" },
    { code: "+672", label: "Antarctica", iso: "aq" },
    { code: "+673", label: "Brunei", iso: "bn" },
    { code: "+674", label: "Nauru", iso: "nr" },
    { code: "+675", label: "Papua New Guinea", iso: "pg" },
    { code: "+676", label: "Tonga", iso: "to" },
    { code: "+677", label: "Solomon Islands", iso: "sb" },
    { code: "+678", label: "Vanuatu", iso: "vu" },
    { code: "+679", label: "Fiji", iso: "fj" },
    { code: "+680", label: "Palau", iso: "pw" },
    { code: "+681", label: "Wallis and Futuna", iso: "wf" },
    { code: "+682", label: "Cook Islands", iso: "ck" },
    { code: "+683", label: "Niue", iso: "nu" },
    { code: "+685", label: "Samoa", iso: "ws" },
    { code: "+686", label: "Kiribati", iso: "ki" },
    { code: "+687", label: "New Caledonia", iso: "nc" },
    { code: "+688", label: "Tuvalu", iso: "tv" },
    { code: "+689", label: "French Polynesia", iso: "pf" },
    { code: "+690", label: "Tokelau", iso: "tk" },
    { code: "+691", label: "Micronesia", iso: "fm" },
    { code: "+692", label: "Marshall Islands", iso: "mh" },
    { code: "+850", label: "North Korea", iso: "kp" },
    { code: "+852", label: "Hong Kong", iso: "hk" },
    { code: "+853", label: "Macau", iso: "mo" },
    { code: "+855", label: "Cambodia", iso: "kh" },
    { code: "+856", label: "Laos", iso: "la" },
    { code: "+880", label: "Bangladesh", iso: "bd" },
    { code: "+886", label: "Taiwan", iso: "tw" },
    { code: "+960", label: "Maldives", iso: "mv" },
    { code: "+961", label: "Lebanon", iso: "lb" },
    { code: "+962", label: "Jordan", iso: "jo" },
    { code: "+963", label: "Syria", iso: "sy" },
    { code: "+964", label: "Iraq", iso: "iq" },
    { code: "+965", label: "Kuwait", iso: "kw" },
    { code: "+966", label: "Saudi Arabia", iso: "sa" },
    { code: "+967", label: "Yemen", iso: "ye" },
    { code: "+968", label: "Oman", iso: "om" },
    { code: "+970", label: "Palestine", iso: "ps" },
    { code: "+971", label: "United Arab Emirates", iso: "ae" },
    { code: "+972", label: "Israel", iso: "il" },
    { code: "+973", label: "Bahrain", iso: "bh" },
    { code: "+974", label: "Qatar", iso: "qa" },
    { code: "+975", label: "Bhutan", iso: "bt" },
    { code: "+976", label: "Mongolia", iso: "mn" },
    { code: "+977", label: "Nepal", iso: "np" },
    { code: "+992", label: "Tajikistan", iso: "tj" },
    { code: "+993", label: "Turkmenistan", iso: "tm" },
    { code: "+994", label: "Azerbaijan", iso: "az" },
    { code: "+995", label: "Georgia", iso: "ge" },
    { code: "+996", label: "Kyrgyzstan", iso: "kg" },
    { code: "+998", label: "Uzbekistan", iso: "uz" },
  ];

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginSuccess, setLoginSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    country_iso: "in",
    country_code: "+91",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const onLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const onRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name === "country_code") {
      const [iso, code] = value.split("|");
      setRegisterForm((prev) => ({
        ...prev,
        country_iso: iso || prev.country_iso,
        country_code: code || prev.country_code,
      }));
      return;
    }
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginSuccess("");
    const result = await login({
      email: loginForm.email,
      password: loginForm.password,
    });
    if (result?.ok) {
      setLoginSuccess("Login successful.");
      router.push(next);
    }
  };

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    setRegisterLoading(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registerForm),
      });
      setRegisterSuccess("Registration successful. Please login.");
      setRegisterForm({
        name: "",
        email: "",
        country_iso: "in",
        country_code: "+91",
        phone: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      setRegisterError(err?.message || "Registration failed.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const selectedCountry =
    countryCodes.find((option) => option.iso === registerForm.country_iso) ||
    countryCodes[0];
  const selectedIso = selectedCountry?.iso;
  const selectedFlagSrc = selectedIso
    ? `https://flagcdn.com/16x12/${selectedIso}.png`
    : "";
  const selectedFlagSrcSet = selectedIso
    ? `https://flagcdn.com/32x24/${selectedIso}.png 2x, https://flagcdn.com/48x36/${selectedIso}.png 3x`
    : "";

  return (
    <main className="min-h-screen bg-white text-black mt-14">
      <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
        <div className="text-center">
          <h1
            className="text-4xl uppercase text-[#4e5a50]"
            style={{ fontFamily: "var(--font-basker)" }}
          >
            My account
          </h1>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 ">
          <div className="lg:pr-14">
            <h2 className="text-2xl font-semibold text-[#4e5a50]">Login</h2>
            <form onSubmit={onLoginSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-thin text-black">
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={onLoginChange}
                  required
                  className="mt-2 w-full rounded-sm border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#4e5a50]"
                  placeholder="Enter your email address..."
                />
              </div>

              <div>
                <label className="text-sm font-thin text-black">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={onLoginChange}
                  required
                  className="mt-2 w-full rounded-sm border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#4e5a50]"
                  placeholder="Enter your password..."
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-black/70">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#7ea36a]"
                  />
                  Remember me
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-black/60 underline-offset-4 hover:underline"
                >
                  Lost your password?
                </a>
              </div>

              {loginError && (
                <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {loginError}
                </p>
              )}
              {loginSuccess && (
                <p className="rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {loginSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-sm bg-gradient-to-r from-[#7a8177] to-[#6a716a] py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:from-[#5f665e] hover:to-[#525a53]"
              >
                {authLoading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>

          <div className="border-black/10 lg:border-l lg:pl-14">
            <h2 className="text-2xl font-semibold text-[#4e5a50]">Register</h2>
            <form onSubmit={onRegisterSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-thin text-black">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  value={registerForm.name}
                  onChange={onRegisterChange}
                  required
                  className="mt-2 w-full rounded-sm border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#4e5a50]"
                  placeholder="Enter your name..."
                />
              </div>

              <div>
                <label className="text-sm font-thin text-black">
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={onRegisterChange}
                  required
                  className="mt-2 w-full rounded-sm border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#4e5a50]"
                  placeholder="Enter your email..."
                />
              </div>

              <div>
                <label className="text-sm font-thin text-black">
                  Phone <span className="text-red-400">*</span>
                </label>
                <div className="mt-2 flex gap-2">
                  <div className="relative w-26">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 px-3 text-sm text-[#4e5a50]">
                      {selectedFlagSrc ? (
                        <img
                          src={selectedFlagSrc}
                          srcSet={selectedFlagSrcSet}
                          width="16"
                          height="12"
                          alt={selectedCountry?.label || "Country"}
                        />
                      ) : (
                        <span className="text-xs text-black/60">--</span>
                      )}
                      <span>{selectedCountry?.code}</span>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#4e5a50]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <select
                      name="country_code"
                      value={`${registerForm.country_iso}|${registerForm.country_code}`}
                      onChange={onRegisterChange}
                      className="w-full rounded-sm border border-black/15 bg-white px-3 py-3 pl-9 pr-8 text-sm outline-none focus:border-[#4e5a50]"
                      style={{
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {countryCodes.map((option) => (
                        <option
                          key={`${option.label}-${option.code}`}
                          value={`${option.iso}|${option.code}`}
                          style={{ color: "#111", WebkitTextFillColor: "#111" }}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    name="phone"
                    value={registerForm.phone}
                    onChange={onRegisterChange}
                    required
                    className="flex-1 rounded-sm border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#4e5a50]"
                    placeholder="9999999999"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-thin text-black">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={onRegisterChange}
                  required
                  className="mt-2 w-full rounded-sm border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#4e5a50]"
                  placeholder="Enter your password..."
                />
              </div>

              <div>
                <label className="text-sm font-thin text-black">
                  Confirm password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={registerForm.password_confirmation}
                  onChange={onRegisterChange}
                  required
                  className="mt-2 w-full rounded-sm border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#4e5a50]"
                  placeholder="Enter your password..."
                />
              </div>

              <p className="text-sm text-black/70">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our privacy policy.
              </p>

              {registerError && (
                <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {registerError}
                </p>
              )}
              {registerSuccess && (
                <p className="rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {registerSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full rounded-sm bg-gradient-to-r from-[#7a8177] to-[#6a716a] py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:from-[#5f665e] hover:to-[#525a53]"
              >
                {registerLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
