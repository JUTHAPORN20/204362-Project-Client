import Vue from 'vue';
import Select from '@/components/Shared/Select.vue';
import DogApiService from '@/services/DogApiService';
import Dog from '@/models/dog';
import util from '@/util';
import _ from 'lodash';
import Modal from '@/components/Shared/Modal.vue';

export default Vue.extend({
  name: 'DogAddUpdate',
  data: () => ({
    dog: null as Dog | null,
    editing: false,
    delShow: false,
    // Arr text select --> display UI
    sexSelect: ['ตัวเมีย', 'ตัวผู้'],
    collarColorSelect: ['สีเขียว', 'สีเหลือง', 'สีแดง'],
    unitSelect: ['ปี', 'เดือน'],
    isAliveSelect: ['มีชีวิต', 'เสียชีวิต'],
    // Arr select --> sent to database
    SexArr: ['F', 'M'],
    collarColorArr: ['G', 'Y', 'R'],
    unitArr: ['Y', 'M'],
    isAliveArr: [true, false],
    // Variable
    sex: undefined as string | undefined,
    collarColor: undefined as string | undefined,
    unit: undefined as string | undefined,
    isAlive: undefined as boolean | undefined,
    // Check Err
    nameErr: false,
    breedErr: false,
    ageErr: false,
    unitErr: false,
    sexErr: false,
    descErr: false,
    colorCollarErr: false,
    isAliveErr: false,
    caretakerPhoneErr: false,
    caretakerErr: false,
    locationErr: false,
  }),
  components: {
    Select,
    Modal,
  },
  created() {
    if (this.$route.params.id !== 'add') {
      DogApiService.getDog(this.$route.params.id).then((val) => {
        this.dog = val.data;
        this.sex = this.dog.sex;
        this.unit = this.dog.ageUnit;
        this.collarColor = this.dog.collarColor;
        this.isAlive = this.dog.isAlive;
      });
    } else {
      this.dog = new Dog();
    }
  },
  computed: {
    getDogunit() {
      if (this.dog) {
        // prettier-ignore
        return this.unitSelect[_.findIndex(this.unitArr, o => o === this.dog!.ageUnit)];
      }
      return null;
    },
    getDogsex() {
      if (this.dog) {
        // prettier-ignore
        return this.sexSelect[_.findIndex(this.SexArr, o => o === this.dog!.sex)];
      }
      return null;
    },
    getDogcolor() {
      if (this.dog) {
        return this.collarColorSelect[
          // eslint-disable-next-line
          _.findIndex(this.collarColorArr, (o) => {
            return o === (this.dog!.collarColor);
          })
        ];
      }
      return null;
    },
    getDogstatus() {
      if (this.dog) {
        // prettier-ignore
        return this.isAliveSelect[_.findIndex(this.isAliveArr, o => o === this.dog!.isAlive)];
      }
      return null;
    },
  },
  methods: {
    saveValidate() {
      // default Err is false
      this.nameErr = false;
      this.breedErr = false;
      this.ageErr = false;
      this.unitErr = false;
      this.sexErr = false;
      this.descErr = false;
      this.colorCollarErr = false;
      this.isAliveErr = false;
      this.caretakerPhoneErr = false;
      this.caretakerErr = false;
      this.locationErr = false;
      let err = false;
      // get value from ref
      // @ts-ignore
      const name = this.$refs.name.value;
      // @ts-ignore
      const breed = this.$refs.breed.value;
      // @ts-ignore
      const age = this.$refs.age.value;
      const sexValidate = this.sex;
      const unitValidate = this.unit;
      // @ts-ignore
      const description = this.$refs.description.value;
      const collarColorValidate = this.collarColor;
      const isAliveValidate = this.isAlive;
      // @ts-ignore
      const caretakerPhone = this.$refs.caretakerPhone.value;
      // @ts-ignore
      const caretaker = this.$refs.caretaker.value;
      // @ts-ignore
      const location = this.$refs.location.value;
      // Check condition Err
      if (name === '') {
        this.nameErr = true;
        err = true;
      }
      if (breed === '') {
        this.breedErr = true;
        err = true;
      }
      if (age === '' || !Number.isInteger(+age) || +age > 21 || +age === 0) {
        this.ageErr = true;
        err = true;
      }
      if (unitValidate === undefined) {
        this.unitErr = true;
        err = true;
      }
      if (sexValidate === undefined) {
        this.sexErr = true;
        err = true;
      }
      if (description === '') {
        this.descErr = true;
        err = true;
      }
      if (collarColorValidate === undefined) {
        this.colorCollarErr = true;
        err = true;
      }
      if (isAliveValidate === undefined) {
        this.isAliveErr = true;
        err = true;
      }
      if (caretakerPhone === '' || caretakerPhone.length > 10) {
        this.caretakerPhoneErr = true;
        err = true;
      }
      if (caretaker === '') {
        this.caretakerErr = true;
        err = true;
      }
      if (location === '') {
        this.locationErr = true;
        err = true;
      }
      if (err) {
        return;
      }
      // @ts-ignore
      this.saveData();
    },
    saveData() {
      this.editing = true;
      const newDog: Dog = {
        id: this.$route.params.id !== 'add' ? this.$route.params.id : undefined,
        // @ts-ignore
        name: util.splitToArr(this.$refs.name.value),
        // @ts-ignore
        breed: this.$refs.breed.value,
        // @ts-ignore
        age: +this.$refs.age.value,
        ageUnit: this.unit,
        sex: this.sex,
        // @ts-ignore
        description: this.$refs.description.value,
        collarColor: this.collarColor,
        isAlive: this.isAlive,
        // @ts-ignore
        caretakerPhone: util.splitToArr(this.$refs.caretakerPhone.value),
        // @ts-ignore
        caretaker: this.$refs.caretaker.value,
        // @ts-ignore
        location: this.$refs.location.value,
      };
      if (this.$route.params.id === 'add') {
        DogApiService.postDog(newDog).then((_a) => {
          this.$router.go(-1);
        });
      } else {
        DogApiService.putDog(this.$route.params.id, newDog).then((_a) => {
          this.$router.go(-1);
        });
      }
    },
    onChangeUnit(event: any) {
      this.unit = this.unitArr[event.currSelect];
    },
    onChangeSex(event: any) {
      this.sex = this.SexArr[event.currSelect];
    },
    onChangeColor(event: any) {
      this.collarColor = this.collarColorArr[event.currSelect];
    },
    onChangeAlive(event: any) {
      this.isAlive = this.isAliveArr[event.currSelect];
    },
    Delete() {
      this.delShow = false;
      this.editing = true;
      DogApiService.delDog(this.$route.params.id).then((_a) => {
        this.$router.go(-1);
      });
    },
  },
});
