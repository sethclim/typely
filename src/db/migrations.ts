import migration0000 from '../../drizzle/0000_cooing_goliath.sql?raw'
import migration0001 from '../../drizzle/0001_breezy_mariko_yashida.sql?raw'

export const migrations = [
	{ name: '0000_init', sql: migration0000 },
	{ name: '0001_instances', sql: migration0001 }
]
