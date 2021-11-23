const { expect } = require("chai");

describe("SharedWallet", function () {
  let sharedWallet;

  it("Despliegue de contrato", async function () {
    //Se toman las primeras 3 direcciones del nodo
    const [owner, add1, add2] = await ethers.getSigners();

    //Se despliega el contrato
    const SharedWallet = await ethers.getContractFactory("SharedWallet");
    sharedWallet = await SharedWallet.deploy();

    await sharedWallet.deployed();

    expect(sharedWallet.address).to.be.properAddress;
  });

  it("Realizar transaccion sin ether en el contrato", async function () {
    //Se toman las primeras 3 direcciones del nodo
    const [owner, add1, add2] = await ethers.getSigners();
    // //El ether enviado se envia a otra cuenta

    await expect(
      sharedWallet
        .connect(owner)
        .withDrawMoney(add2.address, ethers.utils.parseEther("1.0"))
    ).to.be.reverted;
  });

  it("Transferir ether al contrato", async function () {
    //Se toman las primeras 3 direcciones del nodo
    const [owner, add1, add2] = await ethers.getSigners();

    //Se envia 1 ether al contrato
    const tx = await owner.sendTransaction({
      to: sharedWallet.address,
      value: ethers.utils.parseEther("2.0"),
    });

    let resultado = await tx.wait();

    expect(resultado.status).to.equal(1);
  });

  it("Owner transfiere ether de contrato a direccion 1", async function () {
    //Se toman las primeras 3 direcciones del nodo
    const [owner, add1, add2] = await ethers.getSigners();
    // //El ether enviado se envia a otra cuenta
    let tx = await sharedWallet
      .connect(owner)
      .withDrawMoney(add1.address, ethers.utils.parseEther("1.0"));

    let resultado = await tx.wait();

    expect(resultado.status).to.equal(1);
  });

  it("Renounce allowance mensaje", async function () {
    await expect(sharedWallet.renounceOwnership()).to.be.reverted;
  });

  it("Owner agrega allowed direccion 1", async function () {
    //Se toman las primeras 3 direcciones del nodo
    const [owner, add1, add2] = await ethers.getSigners();
    // //El ether enviado se envia a otra cuenta
    let tx = await sharedWallet
      .connect(owner)
      .addAllowance(add1.address, ethers.utils.parseEther("1.0"));

    let resultado = await tx.wait();

    expect(resultado.status).to.equal(1);
  });

  it("Direccion 1 transfiere a direccion 2", async function () {
    //Se toman las primeras 3 direcciones del nodo
    const [owner, add1, add2] = await ethers.getSigners();
    // //El ether enviado se envia a otra cuenta
    let tx = await sharedWallet
      .connect(add1)
      .withDrawMoney(add2.address, ethers.utils.parseEther("1.0"));

    let resultado = await tx.wait();

    expect(resultado.status).to.equal(1);
  });

  it("Direccion 1 vuelve a enviar sin allowance", async function () {
    //Se toman las primeras 3 direcciones del nodo
    const [owner, add1, add2] = await ethers.getSigners();
    // //El ether enviado se envia a otra cuenta
    await expect(
      sharedWallet
        .connect(add1)
        .withDrawMoney(add2.address, ethers.utils.parseEther("1.0"))
    ).to.be.reverted;
  });
});
