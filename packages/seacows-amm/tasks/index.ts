import { task } from 'hardhat/config';
import { deploy } from './deploy';
import { mint } from './mint';
import { initialize } from './initialize';

task('deploy:seacows', 'Deploy Seacows AMM Contracts')
  .addParam('env', 'The env of Seacows Protocol to deploy')
  .setAction(deploy);

task('mint', 'Mint from SeacowsPositionManager')
  .addParam('env', 'The env of Seacows Protocol to deploy')
  .setAction(mint);

task('initialize', 'Initialize SeacowsPositionManager for more data')
  .addParam('env', 'The env of Seacows Protocol to deploy')
  .setAction(initialize);
