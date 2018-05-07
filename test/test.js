"use strict"

process.chdir("test/")


const fs                                  = require("fs")
const sha256                              = require("js-sha256")
const { deepStrictEqual }                 = require("assert")
const { unpackLOD, unpackDEF, unpackPCX } = require("../lib/index")


const files = {}

const hashes = {
   "H3ab_spr.lod": "d1caa924f479ecaa428a4372251ab09993ad48576d9ea5f21da6f17df0c74ed2",
   "AH16_.DEF": "83fb8b1101f81853408bbd26b93449fafa04b31f9e90e01773c27713a59337c8",
   "AH16_.msk": "e702a1b9c463f2fef2349a19984d27c8107d1638658183c4e591fa0bf9112382",
   "Cmummy.def": "de1d4367c68838d79a7331ccbaca086cd3aa3ae409bba054ee7f992d282e0f55",
   "BoArt120.pcx": "8f8d0b330ae12cfdb1f7b581cf0d1d239828bfef626ce3f4df0e9746e1a1c3cd",
   "CslReE3c.pcx": "d99fc077dc70e7173b08fc59291486ce86f19fee50116847a00f097bc4b6df22"
}

// Check if test files are present.
before(async function(){

   const filenames = Object.keys(hashes)
   for( const filename of filenames ){
      if( !exists(`files/${filename}`) )
         throw new Error(`Missing '${filename}'.`)
      files[filename] = await read(`files/${filename}`)
      if( hashes[filename] !== sha256(files[filename]) )
         throw new Error(`'${filename}' hash mismatch.`)
   }

})

describe("lod", function(){

   it("default", function(){
      const lod = unpackLOD(files["H3ab_spr.lod"], { def: false, pcx: false })
      hashArrayBuffers(lod)

      assert(lod.type, "lod (expansion)")
      assert(Object.keys(lod.files), ["AH16_.DEF","AH16_.msk","AH16_e.def","AH16_e.msk","AH17_.DEF","AH17_.msk","AH17_e.def","AH17_e.msk","AHplace.def","AHplace.msk","Artifact.def","ArtifBon.def","AVA0127.def","AVA0127.msk","AVA0129.def","AVA0129.msk","AVChfor0.def","AVChfor0.msk","AVChforX.def","AVChforX.msk","AVChforZ.def","AVChforZ.msk","Avcvgarm.def","Avcvgarm.msk","AVCvgr.def","AVCvgr.msk","AVG2ang0.def","AVG2ang0.msk","AVG2ela.def","AVG2ela.msk","AVG2ele.def","AVG2ele.msk","AVG2elf.def","AVG2elf.msk","AVG2elw.def","AVG2elw.msk","AVG2uni.def","AVG2uni.msk","AVGazur.def","AVGazur.msk","AVGboar.def","AVGboar.msk","AVGcdrg.def","AVGcdrg.msk","AVGelp.def","AVGelp.msk","AVGench.def","AVGench.msk","AVGfbrd.def","AVGfbrd.msk","AVGfdrg.def","AVGfdrg.msk","AVGhalf.def","AVGhalf.msk","AVGmumy.def","AVGmumy.msk","AVGnomd.def","AVGnomd.msk","AVGpeas.def","AVGpeas.msk","AVGpixie.def","AVGpixie.msk","AVGrog.def","AVGrog.msk","AVGrust.def","AVGrust.msk","AVGshrp.def","AVGshrp.msk","AVGtrll.def","AVGtrll.msk","AVLlk1r.def","AVLlk1r.msk","AvLStm1.DEF","AvLStm1.msk","AvLStm2.DEF","AvLStm2.msk","AvLStm3.DEF","AvLStm3.msk","AVLswt00.def","AVLswt00.msk","AVLswt01.def","AVLswt01.msk","AVLswt02.def","AVLswt02.msk","AVLswt03.def","AVLswt03.msk","AVLswt04.def","AVLswt04.msk","AVLswt05.def","AVLswt05.msk","AVLswt06.def","AVLswt06.msk","AVLswt07.def","AVLswt07.msk","AVLswt08.def","AVLswt08.msk","AVLswt09.def","AVLswt09.msk","AVLswt10.def","AVLswt10.msk","AVLswt11.def","AVLswt11.msk","AVLswt12.def","AVLswt12.msk","AVLswt13.def","AVLswt13.msk","AVLswt14.def","AVLswt14.msk","AVLswt15.def","AVLswt15.msk","AVLswt16.def","AVLswt16.msk","AVLswt17.def","AVLswt17.msk","AVLswt18.def","AVLswt18.msk","AVLswt19.def","AVLswt19.msk","AVLswtr0.def","AVLswtr0.msk","AVLswtr1.def","AVLswtr1.msk","AVLswtr2.def","AVLswtr2.msk","AVLswtr3.def","AVLswtr3.msk","AVLswtr4.def","AVLswtr4.msk","AVLswtr5.def","AVLswtr5.msk","AVLswtr6.def","AVLswtr6.msk","AVLswtr7.def","AVLswtr7.msk","AVLswtr8.def","AVLswtr8.msk","AVLswtr9.def","AVLswtr9.msk","AVLtRo00.DEF","AVLtRo00.msk","AVLtRo01.DEF","AVLtRo01.msk","AVLtRo02.DEF","AVLtRo02.msk","AVLtRo03.DEF","AVLtRo03.msk","AVLtRo04.DEF","AVLtRo04.msk","AVLtRo05.DEF","AVLtRo05.msk","AVLtRo06.DEF","AVLtRo06.msk","AVLtRo07.DEF","AVLtRo07.msk","AVLtRo08.DEF","AVLtRo08.msk","AVLtRo09.DEF","AVLtRo09.msk","AVLtRo10.DEF","AVLtRo10.msk","AVLtRo11.DEF","AVLtRo11.msk","AVLtRo12.DEF","AVLtRo12.msk","AVLtrRo0.DEF","AVLtrRo0.msk","AVLtrRo1.DEF","AVLtrRo1.msk","AVLtrRo2.DEF","AVLtrRo2.msk","AVLtrRo3.DEF","AVLtrRo3.msk","AVLtrRo4.DEF","AVLtrRo4.msk","AVLtrRo5.DEF","AVLtrRo5.msk","AVLtrRo6.DEF","AVLtrRo6.msk","AVLtrRo7.DEF","AVLtrRo7.msk","AVLXds01.def","AVLXds01.msk","AVLXds02.def","AVLXds02.msk","AVLXds03.def","AVLXds03.msk","AVLXds04.def","AVLXds04.msk","AVLXds05.def","AVLXds05.msk","AVLXds06.def","AVLXds06.msk","AVLXds07.def","AVLXds07.msk","AVLXds08.def","AVLXds08.msk","AVLXds09.def","AVLXds09.msk","AVLXds10.def","AVLXds10.msk","AVLXds11.def","AVLXds11.msk","AVLXds12.def","AVLXds12.msk","AVLXdt00.def","AVLXdt00.msk","AVLXdt01.def","AVLXdt01.msk","AVLXdt02.def","AVLXdt02.msk","AVLXdt03.def","AVLXdt03.msk","AVLXdt04.def","AVLXdt04.msk","AVLXdt05.def","AVLXdt05.msk","AVLXdt06.def","AVLXdt06.msk","AVLXdt07.def","AVLXdt07.msk","AVLXdt08.def","AVLXdt08.msk","AVLXdt09.def","AVLXdt09.msk","AVLXdt10.def","AVLXdt10.msk","AVLXdt11.def","AVLXdt11.msk","AVLXgr01.def","AVLXgr01.msk","AVLXgr02.def","AVLXgr02.msk","AVLXgr03.def","AVLXgr03.msk","AVLXgr04.def","AVLXgr04.msk","AVLXgr05.def","AVLXgr05.msk","AVLXgr06.def","AVLXgr06.msk","AVLXgr07.def","AVLXgr07.msk","AVLXgr08.def","AVLXgr08.msk","AVLXgr09.def","AVLXgr09.msk","AVLXgr10.def","AVLXgr10.msk","AVLXgr11.def","AVLXgr11.msk","AVLXgr12.def","AVLXgr12.msk","AVLXro01.def","AVLXro01.msk","AVLXro02.def","AVLXro02.msk","AVLXro03.def","AVLXro03.msk","AVLXro04.def","AVLXro04.msk","AVLXro05.def","AVLXro05.msk","AVLXro06.def","AVLXro06.msk","AVLXro07.def","AVLXro07.msk","AVLXro08.def","AVLXro08.msk","AVLXro09.def","AVLXro09.msk","AVLXro10.def","AVLXro10.msk","AVLXro11.def","AVLXro11.msk","AVLXro12.def","AVLXro12.msk","AVLXsu01.def","AVLXsu01.msk","AVLXsu02.def","AVLXsu02.msk","AVLXsu03.def","AVLXsu03.msk","AVLXsu04.def","AVLXsu04.msk","AVLXsu05.def","AVLXsu05.msk","AVLXsu06.def","AVLXsu06.msk","AVLXsu07.def","AVLXsu07.msk","AVLXsu08.def","AVLXsu08.msk","AVLXsu09.def","AVLXsu09.msk","AVLXsu10.def","AVLXsu10.msk","AVLXsu11.def","AVLXsu11.msk","AVLXsu12.def","AVLXsu12.msk","AVLXsw01.def","AVLXsw01.msk","AVLXsw02.def","AVLXsw02.msk","AVLXsw03.def","AVLXsw03.msk","AVLXsw04.def","AVLXsw04.msk","AVLXsw05.def","AVLXsw05.msk","AVLXsw06.def","AVLXsw06.msk","AVLXsw07.def","AVLXsw07.msk","AVLXsw08.def","AVLXsw08.msk","AVLXsw09.def","AVLXsw09.msk","AVLXsw10.def","AVLXsw10.msk","AVLXsw11.def","AVLXsw11.msk","AVLXsw12.def","AVLXsw12.msk","AVRcgen0.def","AVRcgen0.msk","AVRcgen1.def","AVRcgen1.msk","AVRcgen2.def","AVRcgen2.msk","AVRcgen3.def","AVRcgen3.msk","AVRcgen4.def","AVRcgen4.msk","AVRcgen5.def","AVRcgen5.msk","AVRcgen6.def","AVRcgen6.msk","AVRcgen7.def","AVRcgen7.msk","AVRcgn00.def","AVRcgn00.msk","AVRcgn01.def","AVRcgn01.msk","AVRcgn02.def","AVRcgn02.msk","AVRcgn03.def","AVRcgn03.msk","AVRcgn04.def","AVRcgn04.msk","AVRcgn05.def","AVRcgn05.msk","AVRcgn06.def","AVRcgn06.msk","AVRcgn07.def","AVRcgn07.msk","AVRcgn08.def","AVRcgn08.msk","AVSwtch0.def","AVSwtch0.msk","AvWattak.def","AvWattak.msk","AVWazure.def","AVWazure.msk","AVWboar.def","AVWboar.msk","AVWcdrg.def","AVWcdrg.msk","AVWench.def","AVWench.msk","AVWfbird.def","AVWfbird.msk","AVWfdrg.def","AVWfdrg.msk","AVWhalf.def","AVWhalf.msk","AVWicee.def","AVWicee.msk","AVWmagel.def","AVWmagel.msk","AVWmumy.def","AVWmumy.msk","AVWnomd.def","AVWnomd.msk","AVWnrg.def","AVWnrg.msk","AVWpeas.def","AVWpeas.msk","AVWphx.def","AVWphx.msk","AVWpixie.def","AVWpixie.msk","AVWpsye.def","AVWpsye.msk","AVWrog.def","AVWrog.msk","AVWrust.def","AVWrust.msk","AVWsharp.def","AVWsharp.msk","AvWSKEX0.def","AvWSKEX0.msk","AVWsprit.def","AVWsprit.msk","AVWstone.def","AVWstone.msk","AVWstorm.def","AVWstorm.msk","AVWtrll.def","AVWtrll.msk","AVXamDS.def","AVXamDS.msk","AVXamGR.def","AVXamGR.msk","AVXamLV.def","AVXamLV.msk","AVXamRO.def","AVXamRO.msk","AVXamSN.def","AVXamSN.msk","AVXamSU.def","AVXamSU.msk","AVXamSW.def","AVXamSW.msk","AVXbgt00.def","AVXbgt00.msk","AVXbgt10.def","AVXbgt10.msk","AVXbgt20.def","AVXbgt20.msk","AVXbgt30.def","AVXbgt30.msk","AVXbgt40.def","AVXbgt40.msk","AVXbgt50.def","AVXbgt50.msk","AVXbgt60.def","AVXbgt60.msk","AVXbgt70.def","AVXbgt70.msk","AVXbor80.def","AVXbor80.msk","AVXfgld.def","AVXfgld.msk","AVXpsSN.def","AVXpsSN.msk","BoRes.def","C0acid.def","C0fear.def","CADRGN.def","CamCusL.def","CamCusM.def","Cboar.def","Ccdrgn.def","Cench.def","CFBIRD.DEF","CFDRGN.def","CH16.DEF","CH17.DEF","CHalf.def","CIcee.def","Cmagel.def","Cmummy.def","Cnomad.def","Cnrg.def","Cpeas.def","Cphx.def","Cpixie.def","CPrSmalL.def","Cpsyel.def","Crogue.def","CRsDgn.def","Csharp.def","CSprite.def","CSSarm.def","CSScus.def","CSSexit.def","CSSroe.def","Cstone.def","Cstorm.def","Ctroll.def","FlagPort.def","GTBACK.DEF","GTCAMPN.DEF","GTMULTI.DEF","GTSINGL.DEF","GTTUTOR.DEF","HallElem.def","ITPA.def","ITPT.def","MMENUCR.DEF","MMENUHS.DEF","MMENULG.DEF","MMENUNG.DEF","MMENUQT.DEF","Phalf.def","Picee.def","PSkilBon.DEF","RanIsld.def","RanNone.def","RanNorm.def","RanNum0.def","RanNum1.def","RanNum2.def","RanNum3.def","RanNum4.def","RanNum5.def","RanNum6.def","RanNum7.def","RanNum8.def","RanRand.def","RanShow.def","RanSizL.def","RanSizM.def","RanSizS.def","RanSizX.def","RanStrg.def","RanUndr.def","RanWeak.def","ScButCp.def","ScSelC.def","SpellBon.def","SPELLSCR.DEF","SSkilBon.def","TBELblak.def","TBELboat.def","TBELcas2.def","TBELcas3.def","TBELcstl.def","TBELdock.def","TBELdw_0.def","TBELdw_1.def","TBELdw_2.def","TBELdw_3.def","TBELdw_4.def","TBELdw_5.def","TBELdw_6.def","TBELExt1.def","TBELExt2.def","TBELExt3.def","TBELExt4.def","TBELExt5.def","TBELExt6.def","TBELhal2.def","TBELhal3.def","TBELhal4.def","TBELhall.def","TBELHoly.def","TBELHrd1.def","TBELHrd2.def","TBELmag2.def","TBELmag3.def","TBELmag4.def","TBELmag5.def","TBELmage.def","TBELmark.def","TBELsilo.def","TBELSpec.def","TBELtvrn.def","TBELup_0.def","TBELup_1.def","TBELup_2.def","TBELup_3.def","TBELup_4.def","TBELup_5.def","TBELup_6.def","TwCrPort.def","Un32.def","Un44.def"])
      assert(lod.files["AH16_.DEF"], hashes["AH16_.DEF"])
      assert(lod.files["AH16_.msk"], hashes["AH16_.msk"])
      assert(lod.files["Cmummy.def"], hashes["Cmummy.def"])
   })

})

describe("def", function(){

   // Here we check for properties in detail, and below are mainly .pcx frames tests.
   it("default", function(){
      const def = unpackDEF(files["Cmummy.def"])
      hashArrayBuffers(def)

      assert(def.type, "def (creature)")
      assert(def.fullWidth, 450)
      assert(def.fullHeight, 400)
      assert(def.palette, [{"r":0,"g":0,"b":0,"a":0},{"r":0,"g":0,"b":0,"a":64},{"r":255,"g":100,"b":255,"a":255},{"r":255,"g":50,"b":255,"a":255},{"r":0,"g":0,"b":0,"a":128},{"r":0,"g":0,"b":0,"a":0},{"r":0,"g":0,"b":0,"a":128},{"r":0,"g":0,"b":0,"a":64},{"r":255,"g":128,"b":255,"a":255},{"r":255,"g":128,"b":255,"a":255},{"r":230,"g":227,"b":223,"a":255},{"r":239,"g":225,"b":209,"a":255},{"r":233,"g":216,"b":193,"a":255},{"r":214,"g":214,"b":214,"a":255},{"r":222,"g":206,"b":187,"a":255},{"r":206,"g":206,"b":206,"a":255},{"r":215,"g":198,"b":178,"a":255},{"r":204,"g":198,"b":183,"a":255},{"r":212,"g":191,"b":156,"a":255},{"r":208,"g":189,"b":175,"a":255},{"r":207,"g":187,"b":165,"a":255},{"r":189,"g":189,"b":189,"a":255},{"r":189,"g":189,"b":180,"a":255},{"r":198,"g":185,"b":176,"a":255},{"r":242,"g":192,"b":3,"a":255},{"r":207,"g":181,"b":156,"a":255},{"r":198,"g":181,"b":165,"a":255},{"r":198,"g":181,"b":156,"a":255},{"r":214,"g":180,"b":115,"a":255},{"r":181,"g":181,"b":198,"a":255},{"r":181,"g":181,"b":181,"a":255},{"r":189,"g":181,"b":156,"a":255},{"r":200,"g":176,"b":148,"a":255},{"r":189,"g":176,"b":168,"a":255},{"r":251,"g":169,"b":19,"a":255},{"r":181,"g":173,"b":168,"a":255},{"r":188,"g":173,"b":148,"a":255},{"r":181,"g":173,"b":156,"a":255},{"r":173,"g":173,"b":173,"a":255},{"r":190,"g":165,"b":149,"a":255},{"r":189,"g":165,"b":140,"a":255},{"r":181,"g":165,"b":156,"a":255},{"r":173,"g":165,"b":173,"a":255},{"r":181,"g":165,"b":148,"a":255},{"r":181,"g":165,"b":140,"a":255},{"r":224,"g":168,"b":6,"a":255},{"r":173,"g":164,"b":158,"a":255},{"r":165,"g":165,"b":165,"a":255},{"r":237,"g":151,"b":42,"a":255},{"r":173,"g":167,"b":130,"a":255},{"r":173,"g":165,"b":140,"a":255},{"r":181,"g":156,"b":148,"a":255},{"r":173,"g":160,"b":148,"a":255},{"r":182,"g":156,"b":140,"a":255},{"r":165,"g":156,"b":181,"a":255},{"r":199,"g":152,"b":102,"a":255},{"r":241,"g":148,"b":0,"a":255},{"r":173,"g":156,"b":140,"a":255},{"r":173,"g":156,"b":132,"a":255},{"r":165,"g":157,"b":143,"a":255},{"r":173,"g":156,"b":123,"a":255},{"r":181,"g":151,"b":119,"a":255},{"r":150,"g":160,"b":151,"a":255},{"r":173,"g":148,"b":132,"a":255},{"r":173,"g":148,"b":123,"a":255},{"r":166,"g":148,"b":142,"a":255},{"r":209,"g":145,"b":34,"a":255},{"r":165,"g":148,"b":132,"a":255},{"r":166,"g":149,"b":115,"a":255},{"r":165,"g":148,"b":123,"a":255},{"r":212,"g":146,"b":0,"a":255},{"r":156,"g":145,"b":142,"a":255},{"r":156,"g":148,"b":123,"a":255},{"r":166,"g":140,"b":132,"a":255},{"r":166,"g":140,"b":123,"a":255},{"r":156,"g":142,"b":132,"a":255},{"r":166,"g":140,"b":115,"a":255},{"r":244,"g":121,"b":0,"a":255},{"r":160,"g":141,"b":107,"a":255},{"r":156,"g":140,"b":123,"a":255},{"r":156,"g":140,"b":115,"a":255},{"r":148,"g":140,"b":123,"a":255},{"r":212,"g":125,"b":26,"a":255},{"r":146,"g":138,"b":134,"a":255},{"r":148,"g":140,"b":115,"a":255},{"r":226,"g":119,"b":0,"a":255},{"r":210,"g":127,"b":0,"a":255},{"r":159,"g":131,"b":115,"a":255},{"r":156,"g":131,"b":123,"a":255},{"r":154,"g":137,"b":95,"a":255},{"r":148,"g":132,"b":123,"a":255},{"r":148,"g":132,"b":115,"a":255},{"r":150,"g":132,"b":107,"a":255},{"r":140,"g":132,"b":115,"a":255},{"r":140,"g":132,"b":107,"a":255},{"r":189,"g":120,"b":33,"a":255},{"r":148,"g":123,"b":115,"a":255},{"r":136,"g":127,"b":123,"a":255},{"r":153,"g":120,"b":107,"a":255},{"r":192,"g":120,"b":0,"a":255},{"r":209,"g":111,"b":0,"a":255},{"r":140,"g":123,"b":115,"a":255},{"r":144,"g":123,"b":98,"a":255},{"r":140,"g":123,"b":107,"a":255},{"r":132,"g":123,"b":115,"a":255},{"r":132,"g":123,"b":107,"a":255},{"r":132,"g":123,"b":99,"a":255},{"r":156,"g":116,"b":68,"a":255},{"r":211,"g":99,"b":0,"a":255},{"r":140,"g":113,"b":107,"a":255},{"r":191,"g":107,"b":0,"a":255},{"r":123,"g":123,"b":99,"a":255},{"r":145,"g":112,"b":95,"a":255},{"r":132,"g":115,"b":109,"a":255},{"r":132,"g":115,"b":99,"a":255},{"r":165,"g":112,"b":20,"a":255},{"r":132,"g":114,"b":85,"a":255},{"r":123,"g":115,"b":99,"a":255},{"r":123,"g":113,"b":109,"a":255},{"r":207,"g":90,"b":0,"a":255},{"r":123,"g":115,"b":90,"a":255},{"r":185,"g":99,"b":0,"a":255},{"r":132,"g":107,"b":99,"a":255},{"r":115,"g":115,"b":90,"a":255},{"r":123,"g":111,"b":79,"a":255},{"r":123,"g":107,"b":99,"a":255},{"r":123,"g":107,"b":90,"a":255},{"r":115,"g":108,"b":103,"a":255},{"r":185,"g":90,"b":0,"a":255},{"r":115,"g":107,"b":90,"a":255},{"r":115,"g":108,"b":77,"a":255},{"r":158,"g":91,"b":49,"a":255},{"r":169,"g":94,"b":0,"a":255},{"r":129,"g":97,"b":92,"a":255},{"r":126,"g":99,"b":82,"a":255},{"r":188,"g":80,"b":0,"a":255},{"r":115,"g":98,"b":93,"a":255},{"r":164,"g":88,"b":11,"a":255},{"r":115,"g":99,"b":82,"a":255},{"r":57,"g":127,"b":77,"a":255},{"r":106,"g":99,"b":90,"a":255},{"r":105,"g":97,"b":100,"a":255},{"r":107,"g":99,"b":82,"a":255},{"r":169,"g":82,"b":0,"a":255},{"r":122,"g":91,"b":74,"a":255},{"r":124,"g":87,"b":82,"a":255},{"r":126,"g":90,"b":58,"a":255},{"r":99,"g":99,"b":82,"a":255},{"r":153,"g":86,"b":0,"a":255},{"r":99,"g":99,"b":74,"a":255},{"r":107,"g":90,"b":90,"a":255},{"r":107,"g":90,"b":82,"a":255},{"r":107,"g":91,"b":74,"a":255},{"r":129,"g":84,"b":37,"a":255},{"r":99,"g":90,"b":82,"a":255},{"r":160,"g":74,"b":0,"a":255},{"r":99,"g":90,"b":74,"a":255},{"r":97,"g":88,"b":90,"a":255},{"r":136,"g":84,"b":3,"a":255},{"r":101,"g":86,"b":66,"a":255},{"r":90,"g":90,"b":74,"a":255},{"r":129,"g":80,"b":20,"a":255},{"r":123,"g":74,"b":67,"a":255},{"r":101,"g":82,"b":82,"a":255},{"r":101,"g":80,"b":74,"a":255},{"r":154,"g":65,"b":0,"a":255},{"r":93,"g":85,"b":57,"a":255},{"r":90,"g":82,"b":74,"a":255},{"r":88,"g":81,"b":82,"a":255},{"r":131,"g":74,"b":2,"a":255},{"r":90,"g":82,"b":66,"a":255},{"r":82,"g":82,"b":74,"a":255},{"r":96,"g":72,"b":66,"a":255},{"r":131,"g":66,"b":0,"a":255},{"r":121,"g":60,"b":56,"a":255},{"r":121,"g":66,"b":13,"a":255},{"r":84,"g":73,"b":74,"a":255},{"r":82,"g":74,"b":66,"a":255},{"r":85,"g":74,"b":57,"a":255},{"r":91,"g":72,"b":47,"a":255},{"r":92,"g":66,"b":57,"a":255},{"r":100,"g":69,"b":19,"a":255},{"r":128,"g":57,"b":1,"a":255},{"r":74,"g":74,"b":57,"a":255},{"r":82,"g":66,"b":66,"a":255},{"r":74,"g":68,"b":75,"a":255},{"r":74,"g":67,"b":66,"a":255},{"r":74,"g":68,"b":49,"a":255},{"r":74,"g":66,"b":57,"a":255},{"r":92,"g":57,"b":54,"a":255},{"r":66,"g":66,"b":49,"a":255},{"r":66,"g":60,"b":67,"a":255},{"r":119,"g":41,"b":21,"a":255},{"r":94,"g":48,"b":49,"a":255},{"r":66,"g":59,"b":57,"a":255},{"r":102,"g":44,"b":39,"a":255},{"r":96,"g":53,"b":6,"a":255},{"r":74,"g":54,"b":53,"a":255},{"r":66,"g":57,"b":49,"a":255},{"r":63,"g":59,"b":41,"a":255},{"r":89,"g":49,"b":20,"a":255},{"r":54,"g":60,"b":53,"a":255},{"r":86,"g":45,"b":39,"a":255},{"r":18,"g":73,"b":35,"a":255},{"r":70,"g":45,"b":41,"a":255},{"r":56,"g":49,"b":57,"a":255},{"r":59,"g":48,"b":49,"a":255},{"r":64,"g":48,"b":30,"a":255},{"r":57,"g":49,"b":41,"a":255},{"r":92,"g":32,"b":34,"a":255},{"r":49,"g":49,"b":41,"a":255},{"r":66,"g":45,"b":13,"a":255},{"r":49,"g":49,"b":32,"a":255},{"r":57,"g":41,"b":41,"a":255},{"r":48,"g":44,"b":49,"a":255},{"r":71,"g":32,"b":33,"a":255},{"r":49,"g":41,"b":41,"a":255},{"r":90,"g":23,"b":24,"a":255},{"r":49,"g":41,"b":33,"a":255},{"r":49,"g":41,"b":21,"a":255},{"r":41,"g":41,"b":41,"a":255},{"r":41,"g":41,"b":33,"a":255},{"r":94,"g":16,"b":16,"a":255},{"r":41,"g":41,"b":24,"a":255},{"r":23,"g":49,"b":29,"a":255},{"r":71,"g":25,"b":24,"a":255},{"r":53,"g":29,"b":28,"a":255},{"r":82,"g":16,"b":16,"a":255},{"r":41,"g":33,"b":35,"a":255},{"r":63,"g":25,"b":16,"a":255},{"r":61,"g":26,"b":7,"a":255},{"r":41,"g":32,"b":24,"a":255},{"r":21,"g":41,"b":27,"a":255},{"r":74,"g":16,"b":16,"a":255},{"r":33,"g":33,"b":24,"a":255},{"r":32,"g":30,"b":35,"a":255},{"r":33,"g":33,"b":16,"a":255},{"r":83,"g":8,"b":10,"a":255},{"r":62,"g":16,"b":16,"a":255},{"r":45,"g":24,"b":14,"a":255},{"r":24,"g":33,"b":16,"a":255},{"r":21,"g":33,"b":24,"a":255},{"r":33,"g":24,"b":24,"a":255},{"r":69,"g":8,"b":10,"a":255},{"r":33,"g":24,"b":16,"a":255},{"r":33,"g":24,"b":8,"a":255},{"r":24,"g":24,"b":16,"a":255},{"r":23,"g":22,"b":24,"a":255},{"r":24,"g":24,"b":8,"a":255},{"r":10,"g":28,"b":15,"a":255},{"r":50,"g":8,"b":9,"a":255},{"r":26,"g":16,"b":16,"a":255},{"r":16,"g":16,"b":16,"a":255},{"r":18,"g":16,"b":8,"a":255},{"r":21,"g":7,"b":7,"a":255},{"r":8,"g":8,"b":8,"a":255}])
      assert(def.groups, {
         "moving":          ["cmummy58.pcx","cmummy59.pcx","cmummy60.pcx","cmummy61.pcx","cmummy62.pcx","cmummy63.pcx","cmummy64.pcx","cmummy65.pcx"],
         "mouse over":      ["cmummy41.pcx","cmummy42.pcx","cmummy43.pcx","cmummy44.pcx","cmummy45.pcx","cmummy46.pcx","cmummy47.pcx","cmummy48.pcx"],
         "standing":        ["cmummy49.pcx","cmummy52.pcx","cmummy53.pcx","cmummy54.pcx","cmummy55.pcx","cmummy56.pcx"],
         "getting hit":     ["cmummy66.pcx","cmummy67.pcx","cmummy68.pcx","cmummy69.pcx","cmummy70.pcx","cmummy71.pcx","cmummy72.pcx","cmummy73.pcx"],
         "defend":          ["cmummy25.pcx","cmummy26.pcx","cmummy27.pcx","cmummy28.pcx","cmummy28.pcx","cmummy28.pcx","cmummy29.pcx","cmummy30.pcx"],
         "death":           ["cmummy31.pcx","cmummy32.pcx","cmummy33.pcx","cmummy34.pcx","cmummy35.pcx","cmummy36.pcx","cmummy37.pcx","cmummy38.pcx","cmummy39.pcx","cmummy40.pcx"],
         "turn left":       ["cmummy50.pcx","cmummy51.pcx"],
         "turn right":      ["cmummy51.pcx","cmummy50.pcx"],
         "attack up":       ["cmummy17.pcx","cmummy18.pcx","cmummy19.pcx","cmummy20.pcx","cmummy21.pcx","cmummy22.pcx","cmummy23.pcx","cmummy24.pcx"],
         "attack straight": ["cmummy09.pcx","cmummy10.pcx","cmummy11.pcx","cmummy12.pcx","cmummy13.pcx","cmummy14.pcx","cmummy15.pcx","cmummy16.pcx"],
         "attack down":     ["cmummy01.pcx","cmummy02.pcx","cmummy03.pcx","cmummy04.pcx","cmummy05.pcx","cmummy06.pcx","cmummy07.pcx","cmummy08.pcx"],
         "start moving":    ["cmummy57.pcx"],
         "stop moving":     ["cmummy66.pcx"]
      })
      assert(Object.keys(def.images), ["cmummy58.pcx","cmummy59.pcx","cmummy60.pcx","cmummy61.pcx","cmummy62.pcx","cmummy63.pcx","cmummy64.pcx","cmummy65.pcx","cmummy41.pcx","cmummy42.pcx","cmummy43.pcx","cmummy44.pcx","cmummy45.pcx","cmummy46.pcx","cmummy47.pcx","cmummy48.pcx","cmummy49.pcx","cmummy52.pcx","cmummy53.pcx","cmummy54.pcx","cmummy55.pcx","cmummy56.pcx","cmummy66.pcx","cmummy67.pcx","cmummy68.pcx","cmummy69.pcx","cmummy70.pcx","cmummy71.pcx","cmummy72.pcx","cmummy73.pcx","cmummy25.pcx","cmummy26.pcx","cmummy27.pcx","cmummy28.pcx","cmummy29.pcx","cmummy30.pcx","cmummy31.pcx","cmummy32.pcx","cmummy33.pcx","cmummy34.pcx","cmummy35.pcx","cmummy36.pcx","cmummy37.pcx","cmummy38.pcx","cmummy39.pcx","cmummy40.pcx","cmummy50.pcx","cmummy51.pcx","cmummy17.pcx","cmummy18.pcx","cmummy19.pcx","cmummy20.pcx","cmummy21.pcx","cmummy22.pcx","cmummy23.pcx","cmummy24.pcx","cmummy09.pcx","cmummy10.pcx","cmummy11.pcx","cmummy12.pcx","cmummy13.pcx","cmummy14.pcx","cmummy15.pcx","cmummy16.pcx","cmummy01.pcx","cmummy02.pcx","cmummy03.pcx","cmummy04.pcx","cmummy05.pcx","cmummy06.pcx","cmummy07.pcx","cmummy08.pcx","cmummy57.pcx"])
      assert(def.images["cmummy01.pcx"], { width: 58, height: 107, x: 170, y: 161, data: "1a9492ab5d7232ac8e2dcb14aaeef9f7f37a8ffe45c93310466c25a7b4798210" })
      assert(def.images["cmummy41.pcx"], { width: 44, height: 105, x: 174, y: 164, data: "0f26a16426438e89fad22b2852b49abaf1bcbf2529c0163fcf90647e1f233177", selection: "db3595a0a5a62810d1839e54755868249e9dd2f4b858565f4ef4f7808f1a20bf" })
      assert(def.images["cmummy42.pcx"], { width: 50, height: 112, x: 174, y: 157, data: "e4fdd056dbc149844ec15f0112a774f07647b714c3abb03fe2e0534adb116d6b", selection: "e5fddab6ee88c3c3676a91a729f5b18f8e10dc86ade34a5e535b93097fbda9e5" })
   })

   it("{ format: 'png', padding: false }", function(){
      const def = unpackDEF(files["Cmummy.def"], { format: "png", padding: false })
      hashArrayBuffers(def)

      assert(def.type, "def (creature)")
      assert(def.images["cmummy01.pcx"], { width: 58, height: 107, x: 170, y: 161, data: "1a9492ab5d7232ac8e2dcb14aaeef9f7f37a8ffe45c93310466c25a7b4798210" })
      assert(def.images["cmummy41.pcx"], { width: 44, height: 105, x: 174, y: 164, data: "0f26a16426438e89fad22b2852b49abaf1bcbf2529c0163fcf90647e1f233177", selection: "db3595a0a5a62810d1839e54755868249e9dd2f4b858565f4ef4f7808f1a20bf" })
      assert(def.images["cmummy42.pcx"], { width: 50, height: 112, x: 174, y: 157, data: "e4fdd056dbc149844ec15f0112a774f07647b714c3abb03fe2e0534adb116d6b", selection: "e5fddab6ee88c3c3676a91a729f5b18f8e10dc86ade34a5e535b93097fbda9e5" })
   })

   it("{ format: 'png', padding: true }", function(){
      const def = unpackDEF(files["Cmummy.def"], { format: "png", padding: true })
      hashArrayBuffers(def)

      assert(def.type, "def (creature)")
      assert(def.images["cmummy01.pcx"], { width: 58, height: 107, x: 170, y: 161, data: "9c23603da371629e2e91bf1afbd42f29c4dab9e22966f5916ac7e17fcdd0cb9d" })
      assert(def.images["cmummy41.pcx"], { width: 44, height: 105, x: 174, y: 164, data: "78c70edc183a8977c29b41d333fac9f2e267df0c204d8540751bb1c2ac2178ad", selection: "164e2bc4a937c7252f02ededae4b2aa1425480d9e9ab71d03f3c4d09bdf7aa0e" })
      assert(def.images["cmummy42.pcx"], { width: 50, height: 112, x: 174, y: 157, data: "880907f9bf0b706b29f206324519ae7f57dab79a24f77e3a7da2d9f6f05acc49", selection: "218a733a4ce1f1a19322654d0b61e693e2bc116621a39b425a7d6839a2ba7579" })
   })

   it("{ format: 'bitmap', padding: false }", function(){
      const def = unpackDEF(files["Cmummy.def"], { format: "bitmap", padding: false })
      hashArrayBuffers(def)

      assert(def.type, "def (creature)")
      assert(def.images["cmummy01.pcx"], { width: 58, height: 107, x: 170, y: 161, data: "8bfd518ff70b23a42d23b573802acaf4b8055ae361edd4171afd7c265fe7d8e9" })
      assert(def.images["cmummy41.pcx"], { width: 44, height: 105, x: 174, y: 164, data: "a341bf95e1876da8712682e634500c86bfa48b5d985bc7f1d2cbed7913237c0b", selection: "91736a4ba102c4dc9c14e5d312573153dc04c69992fc117d97046f64f26d33a9" })
      assert(def.images["cmummy42.pcx"], { width: 50, height: 112, x: 174, y: 157, data: "9ddcea0f56781f6e6e062cb3984713964ada331d62617314924b02866284c8c2", selection: "680655b9abc255d7e32d9d26e3ffa6dde94fffeaa20e1a1f1a970d1a570fd9e9" })
   })

})

describe("pcx", function(){

   it("default", function(){
      let pcx

      pcx = unpackPCX(files["BoArt120.pcx"])
      hashArrayBuffers(pcx)
      assert( pcx, {
         type: "pcx (indexed)",
         width: 58,
         height: 64,
         data: "80bd002f90a4dba243d481db565362f04fe4584fe2b5788170e09f18311bdcb0"
      })

      pcx = unpackPCX(files["CslReE3c.pcx"])
      hashArrayBuffers(pcx)
      assert( pcx, {
         type: "pcx (bgr)",
         width: 400,
         height: 232,
         data: "6ab01e1082ec8fca809e02252a17e7e8f69b097c67ebbbec7f7100a868193512"
      })
   })

   it("{ format: 'png' }", function(){
      let pcx

      pcx = unpackPCX(files["BoArt120.pcx"], { format: "png" })
      hashArrayBuffers(pcx)
      assert( pcx, {
         type: "pcx (indexed)",
         width: 58,
         height: 64,
         data: "80bd002f90a4dba243d481db565362f04fe4584fe2b5788170e09f18311bdcb0"
      })

      pcx = unpackPCX(files["CslReE3c.pcx"], { format: "png" })
      hashArrayBuffers(pcx)
      assert( pcx, {
         type: "pcx (bgr)",
         width: 400,
         height: 232,
         data: "6ab01e1082ec8fca809e02252a17e7e8f69b097c67ebbbec7f7100a868193512"
      })
   })

   it("{ format: 'bitmap' }", function(){
      let pcx

      pcx = unpackPCX(files["BoArt120.pcx"], { format: "bitmap" })
      hashArrayBuffers(pcx)
      assert( pcx, {
         type: "pcx (indexed)",
         width: 58,
         height: 64,
         data: "9795286c67017c18192c6d7c139c41c85527d442284167c04f3a0ec269ec2f7d"
      })

      pcx = unpackPCX(files["CslReE3c.pcx"], { format: "bitmap" })
      hashArrayBuffers(pcx)
      assert( pcx, {
         type: "pcx (bgr)",
         width: 400,
         height: 232,
         data: "eea746477f53617dd42dfe176e9b5b14c0f18f65375453df4a9b0b1b5c59fe75"
      })
   })

})


function assert( a, b, message = "Assertion error" ){

   try{
      deepStrictEqual(a, b)
   }
   catch(e){
      a = JSON.stringify(a, null, 2)
      a = a.slice(0, 500) + (a.length > 500 ? " ..." : "")

      b = JSON.stringify(b, null, 2)
      b = b.slice(0, 500) + (b.length > 500 ? " ..." : "")

      throw new Error("\n\nEXPECTED\n" + b + "\n\nACTUAL\n" + a)
   }

}


// Replace ArrayBuffers with their sha256 hashes.

function hashArrayBuffers( object ){

   if( typeof object !== "object" )
      return

   const keys = Object.keys(object)
   for( const key of keys ){
      if( object[key] instanceof ArrayBuffer )
         object[key] = sha256(object[key])
      else
         hashArrayBuffers(object[key])
   }

}


function read( path ){

   return new Promise(function(resolve, reject){
      fs.readFile(path, function(error, result){
         if( error )
            reject(error)
         resolve(result)
      })
   })

}

function exists( path ){
   
   return fs.existsSync(path)

}
