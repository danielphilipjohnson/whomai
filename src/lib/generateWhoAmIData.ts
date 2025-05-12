
interface WhoAmIData {
	ipaddress: string;
	os: string;
	browser_name: string;
	browser_version: string;
	language: string;
	parsed_language: string;
	software: string;
	total_requests: number;
}


export const generateWhoAmIData = (): WhoAmIData => {
	const ip = `${rand(1, 255)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 255)}`;
	const osList = ['Windows 10', 'macOS Ventura', 'Ubuntu 22.04', 'Arch Linux'];
	const browserList = ['Chrome', 'Firefox', 'Safari', 'Edge'];

	const os = randomChoice(osList);
	const browser = randomChoice(browserList);
	const version = `${rand(90, 120)}.0.${rand(1000, 5000)}.124`;

	const language = 'en-US,en;q=0.9';

	return {
		ipaddress: ip,
		os,
		browser_name: browser,
		browser_version: version,
		language,
		parsed_language: 'English (United States)',
		software: `Mozilla/5.0 (${os}; x64) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${version} Safari/537.36`,
		total_requests: rand(1, 5000),
	};
};

const rand = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const randomChoice = <T>(arr: T[]): T =>
	arr[Math.floor(Math.random() * arr.length)];
