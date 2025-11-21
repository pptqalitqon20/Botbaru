const fs = require('fs')
const chalk = require('chalk');
const moment = require('moment-timezone');
const { pickRandom } = require('./function');

async function setTemplateMenu(naze, type, m, prefix, setv, db, options = {}) {
	const hari = moment.tz('Asia/Jakarta').locale('id').format('dddd');
	const tanggal = moment.tz('Asia/Jakarta').locale('id').format('DD/MM/YYYY');
	const jam = moment.tz('Asia/Jakarta').locale('id').format('HH:mm:ss');
	const ucapanWaktu = jam < '05:00:00' ? 'Selamat Pagi 🌉' : jam < '11:00:00' ? 'Selamat Pagi 🌄' : jam < '15:00:00' ? 'Selamat Siang 🏙' : jam < '18:00:00' ? 'Selamat Sore 🌅' : jam < '19:00:00' ? 'Selamat Sore 🌃' : jam < '23:59:00' ? 'Selamat Malam 🌌' : 'Selamat Malam 🌌';

	// ==========================
	// TEKS MENU UTAMA PPTQ
	// ==========================
	const menuText = `
📲 *MENU UTAMA BOT PPTQ AL-ITQON*

🏫📢 *FITUR BERKAITAN DENGAN PPTQ AL-ITQON*
1️⃣ Lihat Struktur Organisasi _(ketik angka 1)_

====================================

📖📢 *FITUR BERKAITAN DENGAN KETAHFIDZAN*
2️⃣ Lihat Hafalan Santri _(ketik 2)_
3️⃣ Daftar Santri Ujian Bulanan _(ketik 3)_

====================================

⚙️📢 *FITUR KEISLAMAN*
4️⃣ Tanya Tentang Islam, Qur'an, Tafsir, Sejarah, Hadis
   Contoh:
   ➡️ Ayat 10 Surah Al-Baqarah
   ➡️ Penulis Ar-Rahiq Al-Makhtum?

5️⃣ Download Audio Murottal
   - !audio:114
   - !audio:1

====================================

⚙️📢 *FITUR TAMBAHAN*
6️⃣ Ubah Gambar ke PDF  
7️⃣ Gabung & Ambil Halaman PDF  

Semoga bermanfaat 🤲
`.trim();

	// ==========================
	// TYPE 1 & 2: BUTTON + LIST
	// ==========================
	if (type == 1 || type == 'buttonMessage' || type == 2 || type == 'listMessage') {
		await naze.sendButtonMsg(
			m.chat,
			{
				text: `Halo @${m.sender.split('@')[0]}\n\n` + menuText,
				footer: ucapanWaktu,
				mentions: [m.sender],
				contextInfo: {
					forwardingScore: 10,
					isForwarded: true,
				},
				buttons: [
					// QUICK REPLY (kalau mau pakai)
					{
						buttonId: `${prefix}allmenu`,
						buttonText: { displayText: 'All Menu' },
						type: 1,
					},
					// LIST BUTTON: DAFTAR MENU (nativeFlow)
					{
						buttonId: 'daftar_menu',
						buttonText: { displayText: '📂 Daftar Menu' },
						type: 2,
						nativeFlowInfo: {
							name: 'single_select',
							paramsJson: JSON.stringify({
								title: 'Menu Utama PPTQ AL-ITQON',
								sections: [
									{
										title: 'Silakan Pilih Menu',
										rows: [
											{
												title: '🏫 Fitur PPTQ AL-ITQON',
												id: 'menu_pptq',
											},
											{
												title: '📖 Fitur Ketahfidzan',
												id: 'menu_hafalan',
											},
											{
												title: '⚙️ Fitur Keislaman',
												id: 'menu_islam',
											},
											{
												title: '🛠 Fitur Bermanfaat Lainnya',
												id: 'menu_tools',
											},
										],
									},
								],
							}),
						},
					},
				],
			},
			{ quoted: m }
		);
	}

	// ==========================
	// TYPE 3: DOCUMENT MESSAGE
	// (BIARKAN MIRIP VERSI ASLI,
	// HANYA KITA GANTI CAPTION KE MENU PPTQ)
	// ==========================
	else if (type == 3 || type == 'documentMessage') {
		let profile
		try {
			profile = await naze.profilePictureUrl(m.sender, 'image');
		} catch (e) {
			profile = fake.anonim
		}
		const menunya = `
╭──❍「 *USER INFO* 」❍
├ *Nama* : ${m.pushName ? m.pushName : 'Tanpa Nama'}
├ *Id* : @${m.sender.split('@')[0]}
├ *User* : ${options.isVip ? 'VIP' : options.isPremium ? 'PREMIUM' : 'FREE'}
├ *Limit* : ${options.isVip ? 'VIP' : db.users[m.sender].limit }
├ *Uang* : ${db.users[m.sender] ? db.users[m.sender].money.toLocaleString('id-ID') : '0'}
╰─┬────❍
╭─┴─❍「 *BOT INFO* 」❍
├ *Nama Bot* : ${db?.set?.[options.botNumber]?.botname || 'Hitori Bot'}
├ *Powered* : @${'0@s.whatsapp.net'.split('@')[0]}
├ *Owner* : @${owner[0].split('@')[0]}
├ *Mode* : ${naze.public ? 'Public' : 'Self'}
├ *Prefix* :${db.set[options.botNumber].multiprefix ? '「 MULTI-PREFIX 」' : ' *'+prefix+'*' }
╰─┬────❍
╭─┴─❍「 *ABOUT* 」❍
├ *Tanggal* : ${tanggal}
├ *Hari* : ${hari}
├ *Jam* : ${jam} WIB
╰──────❍\n`.trim();

		await m.reply({
			document: fake.docs,
			fileName: ucapanWaktu,
			mimetype: pickRandom(fake.listfakedocs),
			fileLength: '100000000000000',
			pageCount: '999',
			caption: menunya + '\n\n' + menuText,
			contextInfo: {
				mentionedJid: [m.sender, '0@s.whatsapp.net', owner[0] + '@s.whatsapp.net'],
				forwardingScore: 10,
				isForwarded: true,
				forwardedNewsletterMessageInfo: {
					newsletterJid: my.ch,
					serverMessageId: null,
					newsletterName: 'Join For More Info'
				},
				externalAdReply: {
					title: options.author,
					body: options.packname,
					showAdAttribution: false,
					thumbnailUrl: profile,
					mediaType: 1,
					previewType: 0,
					renderLargerThumbnail: true,
					mediaUrl: my.gh,
					sourceUrl: my.gh,
				}
			}
		})
	}

	// ==========================
	// TYPE 4: VIDEO (BELUM DIISI)
	// ==========================
	else if (type == 4 || type == 'videoMessage') {
		// bisa kamu isi sendiri nanti jika mau
	}

	// ==========================
	// FALLBACK: PLAIN TEXT
	// ==========================
	else {
		m.reply(`${ucapanWaktu} @${m.sender.split('@')[0]}\nSilakan gunakan *${prefix}menu* untuk membuka menu utama.`)
	}
}

module.exports = setTemplateMenu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});
